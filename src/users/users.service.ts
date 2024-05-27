import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CreateUserInput } from './dto/createUser.input';
import { FindUserInput } from './dto/findOne.input';
import { DeleteUserInput, UpdateUserInput, UpdateUserProfileInput } from './dto/updateUser.input';
import { User, UserDocument } from './entities/user.schema';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { Proposal } from 'src/proposal/entities/proposal.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ConnectionStatus, NotificationType } from 'src/notifications/entities/notification.schema';
import { IUser, IUserLocation } from './entities/user.entity';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name) private readonly userCollection: Model<UserDocument>,
        private readonly sharedService: SharedService,
        private readonly notificationService: NotificationsService,
    ) { }

    public async create(createUserInput: CreateUserInput): Promise<User> {
        const email = createUserInput.email.toLowerCase();
        const user = await this.userCollection.findOne({ email });
        if (user) {
            throw new HttpException(
                { message: 'Email already taken Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
                { cause: new Error('Email already taken Error') });
        }

        const saltOrRounds = 10;
        const password = createUserInput.password;
        createUserInput.password = await bcrypt.hash(password, saltOrRounds);

        const location: IUserLocation = {
            city: createUserInput.city,
            country: createUserInput.country,
            isoCode: createUserInput.isoCountryCode
        };

        delete createUserInput.city;
        delete createUserInput.country;
        delete createUserInput.isoCountryCode;

        const userObj = { ...createUserInput, location, email };

        const savedUser = new this.userCollection(userObj);
        await savedUser.save();
        if (!savedUser) {
            throw new InternalServerErrorException('Error creating account');
        }
        delete savedUser.password;
        const { password: _, ...userWithoutPassword } = savedUser.toObject();

        return userWithoutPassword as User;
    }

    //TODO Config this for pagination, follow this tutorial: https://javascript.plainenglish.io/graphql-nodejs-mongodb-made-easy-with-nestjs-and-mongoose-29f9c0ea7e1d
    // findAll(paginationQuery?: PaginationInput) {
    //     const { limit, offset } = paginationQuery;
    //     return this.collection.find().skip(offset).limit(limit);
    // }

    public async findAll(): Promise<User[]> {
        return this.userCollection.find({});
    }

    public async getConnections(userId: string): Promise<User[]> {
        const user = await this.userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new NotFoundException('User not found!');
        }

        return this.userCollection.find({ _id: { $in: user.connectionsIds } });
    }

    public findOne(query: FindUserInput): Promise<User> {
        return this.userCollection.findOne({ ...query }).lean();
    }

    public async getUser(query: FindUserInput): Promise<User> {
        const user = await this.userCollection.findOne({ ...query });
        if (!user) {
            throw new NotFoundException('Account not found');
        }
        return user;
    }

    public async updateOne(queryObj: FilterQuery<IUser>, updateUserInput: UpdateUserInput): Promise<User> {
        delete updateUserInput._id;
        const updatedUser = await this.userCollection.findOneAndUpdate(
            queryObj,
            { $set: updateUserInput },
            { new: true }
        ).lean();

        if (!updatedUser) {
            throw new NotFoundException('Account not found');
        }

        return updatedUser;
    }

    public async updateUserProfile(email: string, input: UpdateUserProfileInput) {
        const updatedUserParams: Partial<User> = {};

        if (input.city) {
            updatedUserParams['city'] = input.city;
        }

        if (input.country) {
            updatedUserParams['country'] = input.country;
        }

        if (input.isoCountryCode) {
            updatedUserParams['isoCode'] = input.isoCountryCode;
        }

        const updatedUser = await this.updateOne({ email: email?.toLowerCase() }, updatedUserParams);
        return updatedUser;
    }

    public async addProposal(userId: string, proposalIdStr: string) {
        const _id = new ObjectId(userId);
        const proposalId = new ObjectId(proposalIdStr);

        const result = await this.userCollection.findOneAndUpdate(
            { _id },
            {
                $push: { sentProposalsIds: proposalId },
            },
            { returnDocument: 'after' }
        );

        if (!result) {
            throw new NotFoundException('Listing not found');
        }
        return result;
    }

    public async remove(input: DeleteUserInput): Promise<boolean> {
        const { _id } = input;
        const response = await this.userCollection.deleteOne({ _id: new ObjectId(_id) });
        return response.deletedCount === 1;
    }

    public async updateBookmarkedListings(user: User, listingIdStr: string) {
        const listingId = new Types.ObjectId(listingIdStr);

        const bookmarkedListingIds = [...user.bookmarkedListingIds];
        const index = bookmarkedListingIds.findIndex((id) => id.equals(listingId));

        if (index !== -1) {
            bookmarkedListingIds.splice(index, 1);
        } else {
            bookmarkedListingIds.push(listingId);
        }

        const updatedUser = await this.updateOne({ _id: user._id }, { bookmarkedListingIds: bookmarkedListingIds });
        return { bookmarkedListingIds: updatedUser.bookmarkedListingIds };
    }

    public getUserProposals(userId: string): Promise<Proposal[]> {
        return this.sharedService.getUserProposals(userId);
    }

    public async sendConnectionRequest(user: User, connectionId: string) {

        try {

            const connectionUser = await this.getUser({ _id: new ObjectId(connectionId) });

            const pendingUserConnectionRequestsIds = [...connectionUser.pendingUserConnectionRequestsIds];
            const index = pendingUserConnectionRequestsIds.findIndex((id) => id.equals(user._id));
            const isRequestExisting = index !== -1;

            if (isRequestExisting) {
                pendingUserConnectionRequestsIds.splice(index, 1);
            } else {
                pendingUserConnectionRequestsIds.push(user._id);
            }

            const updatedUser = await this.updateOne(
                {
                    _id: new ObjectId(connectionId)
                },
                {
                    pendingUserConnectionRequestsIds
                }
            );

            //Keep this for the push notification
            // const twoWeeksAgo = new Date();
            // twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            // const existingNotificationSent = await this.notificationService.findOne(
            //     {
            // type: NotificationType.CONNECTION_REQUEST,
            // senderId: user._id,
            //         createdAt: {
            //             $gte: twoWeeksAgo,
            //         } as any
            //     }
            // );
            if (!isRequestExisting) {
                await this.notificationService.sendPushNotification(
                    {
                        message: `${user.firstName} ${user.lastName} has requested to connect with you`,
                        senderId: user._id.toString(),
                        recipientId: connectionId,
                        title: 'Connection Request',
                        type: NotificationType.CONNECTION_REQUEST,
                        metadata: {
                            status: ConnectionStatus.PENDING
                        }
                    }
                );
            } else {
                await this.notificationService.deleteNotification(
                    {
                        type: NotificationType.CONNECTION_REQUEST,
                        senderId: user._id,
                        metadata: {
                            status: ConnectionStatus.PENDING
                        }
                    }
                );
            }

            return updatedUser;

        } catch (error) {
            console.log('error: ', error);

        }
    }

    async updateUser(userId: string, updateOperations: UpdateQuery<User>): Promise<boolean> {
        const result = await this.userCollection.updateOne(
            { _id: new Types.ObjectId(userId) },
            updateOperations,
            { new: true }
        );

        return result.modifiedCount === 0;
    }

    public async respondToConnectionRequest(connectionRecipient: User, connectionSenderId: string, connectionStatus: ConnectionStatus): Promise<boolean> {

        await this.notificationService.respondToConnection(connectionRecipient._id.toString(), connectionStatus);
        if (connectionStatus === ConnectionStatus.REJECTED) {
            const result = await this.userCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(connectionRecipient._id)
                },
                {
                    $pull: {
                        pendingUserConnectionRequestsIds: new ObjectId(connectionSenderId)
                    }
                },
                {
                    new: true,
                    rawResult: true,
                    includeResultMetadata: true
                }
            );
            if (result && result.lastErrorObject) {
                return result.lastErrorObject.updatedExisting;
            }

            return false;
        }

        await this.notificationService.sendPushNotification(
            {
                message: `${connectionRecipient.firstName} ${connectionRecipient.lastName} has accepted your connection request`,
                senderId: connectionRecipient._id.toString(),
                recipientId: connectionSenderId,
                title: 'Connection Request',
                type: NotificationType.CONNECTION_REQUEST_ACCEPTED,
            }
        );

        const responses = await Promise.all(
            [
                this.updateUser(
                    connectionRecipient._id.toString(),
                    {
                        $push: {
                            connectionsIds: new ObjectId(connectionSenderId)
                        }
                    },
                ),
                this.updateUser(
                    connectionSenderId,
                    {
                        $push: {
                            connectionsIds: connectionRecipient._id
                        }
                    }
                )
            ]
        );

        return responses.filter((response) => response === true).length >= 1;
    }
}

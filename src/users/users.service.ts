import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { CreateUserInput, Role } from './dto/createUser.input';
import { FindUserInput } from './dto/findOne.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.schema';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { Proposal } from 'src/proposal/entities/proposal.schema';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.schema';

@Injectable()
export class UsersService {

    constructor(
        @Inject('USERS_COLLECTION') private readonly db: Db,
        private readonly sharedService: SharedService,
        private readonly notificationService: NotificationsService,
    ) {

    }

    private get userCollection(): Collection<User> {
        return this.db.collection<User>('users');
    }

    public async create(createUserInput: CreateUserInput): Promise<User> {
        const user = await this.userCollection.findOne({ email: createUserInput.email.toLowerCase() });
        if (user) {
            throw new HttpException(
                { message: 'Email already taken Error' },
                HttpStatus.UNPROCESSABLE_ENTITY,
                { cause: new Error('Email already taken Error') });
        }

        const saltOrRounds = 10;
        const password = createUserInput.password;
        createUserInput.password = await bcrypt.hash(password, saltOrRounds);

        const defaults: Partial<User> = {
            bookmarkedListingIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isVerified: false,
            role: Role.TRADER,
            profilePhoto: 'https://spng.pngfind.com/pngs/s/676-6764065_default-profile-picture-transparent-hd-png-download.png',
            sentProposalsIds: [],
            connectionsIds: [],
            reputation: 0,
            pendingUserConnectionRequestsIds: [],
        }

        const userObj: User = { ...createUserInput, ...defaults, email: createUserInput.email.toLowerCase() };

        const { insertedId } = await this.userCollection.insertOne({ ...userObj });

        if (!insertedId) {
            throw new InternalServerErrorException('Error creating account');
        }
        const returnedUser = { ...userObj, _id: insertedId };
        delete returnedUser.password;

        return { ...returnedUser };

    }

    //TODO Config this for pagination, follow this tutorial: https://javascript.plainenglish.io/graphql-nodejs-mongodb-made-easy-with-nestjs-and-mongoose-29f9c0ea7e1d
    // findAll(paginationQuery?: PaginationInput) {
    //     const { limit, offset } = paginationQuery;
    //     return this.collection.find().skip(offset).limit(limit);
    // }

    public async findAll(): Promise<User[]> {
        return await this.userCollection.find().toArray();
    }

    public async findOne(query: FindUserInput): Promise<User> {
        const user = await this.userCollection.findOne({ ...query });
        if (!user) {
            throw new NotFoundException('Account not found');
        }
        return user;
    }

    public async update(queryObj: Partial<User>, updateUserInput: UpdateUserInput) {
        const { _id, ...restUpdateUserInput } = updateUserInput
        const { value } = await this.userCollection.findOneAndUpdate(
            {
                ...queryObj
            },
            {
                $set: {
                    ...restUpdateUserInput,
                    updatedAt: new Date()
                }
            },
            {
                upsert: false,
                returnDocument: 'after'
            }
        )
        if (!value) {
            throw new NotFoundException('Account not found');
        }
        return value;
    }

    public async addProposal(userId: string, proposalIdStr: string) {
        const _id = new ObjectId(userId);
        const proposalId = new ObjectId(proposalIdStr);

        const result = await this.userCollection.findOneAndUpdate(
            { _id },
            {
                $push: { sentProposalsIds: proposalId },
                $currentDate: { updatedAt: true },
            },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

    public async remove(input: DeleteUserInput): Promise<boolean> {
        const { _id } = input;
        const response = await this.userCollection.deleteOne({ _id: new ObjectId(_id) });
        return response.deletedCount === 1;
    }

    public async updateBookmarkedListings(user: User, listingIdStr: string) {
        const listingId = new ObjectId(listingIdStr);

        const bookmarkedListingIds = [...user.bookmarkedListingIds];
        const index = bookmarkedListingIds.findIndex((id) => id.equals(listingId));

        if (index !== -1) {
            bookmarkedListingIds.splice(index, 1);
        } else {
            bookmarkedListingIds.push(listingId);
        }

        const updatedUser = await this.update({ _id: user._id }, { bookmarkedListingIds: bookmarkedListingIds });
        return { bookmarkedListingIds: updatedUser.bookmarkedListingIds };
    }


    public getUserProposals(userId: string): Promise<Proposal[]> {
        return this.sharedService.getUserProposals(userId);
    }

    public async sendConnectionRequest(user: User, connectionId: string) {

        try {

            const connectionUser = await this.findOne({ _id: new ObjectId(connectionId) })

            const pendingUserConnectionRequestsIds = [...connectionUser.pendingUserConnectionRequestsIds];
            const index = pendingUserConnectionRequestsIds.findIndex((id) => id.equals(user._id));
            const isRequestExisting = index !== -1;

            if (isRequestExisting) {
                pendingUserConnectionRequestsIds.splice(index, 1);
            } else {
                pendingUserConnectionRequestsIds.push(user._id);
            }


            if (connectionUser.pendingUserConnectionRequestsIds.includes(user._id)) {
                throw new ForbiddenException('Connection request already sent');
            }

            const updatedUser = await this.userCollection.findOneAndUpdate(
                {
                    _id: new ObjectId(connectionId)
                },
                {
                    $set: {
                        pendingUserConnectionRequestsIds
                    }
                },
                {
                    upsert: false,
                    returnDocument: 'after'
                }
            );

            // //Keep this for the push notification
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
                    }
                );
            } else {
                await this.notificationService.deleteOne(
                    {
                        type: NotificationType.CONNECTION_REQUEST,
                        senderId: user._id,
                    }
                );
            }

            return updatedUser.value;

        } catch (error) {
            console.log('error: ', error);

        }
    }

    public async respondToConnectionRequest(loggedInUserId: string, connectionId: string): Promise<boolean> {

        const responses = await Promise.all(
            [
                this.userCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(loggedInUserId)
                    },
                    {
                        $push: {
                            connectionsIds: new ObjectId(connectionId)
                        }
                    },
                ),
                this.userCollection.findOneAndUpdate(
                    {
                        _id: new ObjectId(connectionId)
                    },
                    {
                        $push: {
                            connectionsIds: new ObjectId(loggedInUserId)
                        }
                    },
                ),
            ]
        );

        return responses[0].ok === 1 && responses[1].ok === 1;
    }


}

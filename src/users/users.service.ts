import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { CreateUserInput, Role } from './dto/createUser.input';
import { FindUserInput } from './dto/findOne.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.schema';
import * as bcrypt from 'bcrypt';
import { SharedService } from 'src/shared/shared.service';
import { Proposal } from 'src/proposal/entities/proposal.schema';

@Injectable()
export class UsersService {

    constructor(
        @Inject('USERS_COLLECTION') private readonly db: Db,
        private readonly sharedService: SharedService,
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


}

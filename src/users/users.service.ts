import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { CreateUserInput } from './dto/createUser.input';
import { FindUserInput } from './dto/findOne.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(@Inject('USERS_COLLECTION') private readonly db: Db) { }

    private get collection(): Collection<User> {
        return this.db.collection<User>('users');
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const user = await this.collection.findOne({ email: createUserInput.email });
        if (user) {
            throw new HttpException({ message: 'Email already taken Error' }, HttpStatus.UNPROCESSABLE_ENTITY, { cause: new Error('Email already taken Error') });
        }

        const saltOrRounds = 10;
        const password = createUserInput.password;
        createUserInput.password = await bcrypt.hash(password, saltOrRounds);
        const { insertedId } = await this.collection.insertOne({ ...createUserInput });
        if (!insertedId) {
            throw new NotFoundException('Unable to insert records');
        }
        return { ...createUserInput, _id: insertedId };

    }

    //TODO Config this for pagination, follow this tutorial: https://javascript.plainenglish.io/graphql-nodejs-mongodb-made-easy-with-nestjs-and-mongoose-29f9c0ea7e1d
    // findAll(paginationQuery?: PaginationInput) {
    //     const { limit, offset } = paginationQuery;
    //     return this.collection.find().skip(offset).limit(limit);
    // }

    async findAll(): Promise<User[]> {
        return await this.collection.find().toArray();
    }

    async findOne(query: FindUserInput): Promise<User> {
        const user = await this.collection.findOne({ ...query });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async update(updateUserInput: UpdateUserInput) {
        const { _id, ...restUpdateUserInput } = updateUserInput
        const { value } = await this.collection.findOneAndUpdate(
            {
                _id: new ObjectId(_id)
            },
            {
                $set: {
                    ...restUpdateUserInput
                }
            },
        )
        if (!value) {
            throw new NotFoundException('User not found');
        }
        return value;
    }

    async remove(input: DeleteUserInput): Promise<boolean> {
        const { _id } = input;
        const response = await this.collection.deleteOne({ _id: new ObjectId(_id) });
        return response.deletedCount === 1;
    }
}

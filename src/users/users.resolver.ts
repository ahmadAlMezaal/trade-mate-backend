import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/createUser.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { FindUserInput } from './dto/findOne.input';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Mutation(() => User, { name: 'createUser' })
    createUser(@Args('input') createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

    //TODO: add this for pagination
    // @Query(() => [User], { name: 'users' })
    // findAll(@Args('input') paginationQuery?: PaginationInput) {
    //     return this.usersService.findAll(paginationQuery);
    // }

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'user' })
    async findOne(@Args('input') input: FindUserInput): Promise<User> {
        return this.usersService.findOne(input);
    }

    @Mutation(() => User, { name: 'updateUser' })
    updateUser(@Args('input') updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput);
    }

    @Mutation(() => Boolean, { name: 'deleteUser' })
    async removeUser(@Args('input') input: DeleteUserInput) {
        return await this.usersService.remove(input);
    }
}

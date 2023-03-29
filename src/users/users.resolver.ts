import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './dto/createUser.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { FindUserInput } from './dto/findOne.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly userService: UsersService) { }

    @Query(() => User, { name: 'profile' })
    @UseGuards(JwtAuthGuard)
    public me(@CurrentUser() user: User): User {
        return user
    }

    @Mutation(() => User, { name: 'createUser' })
    createUser(@Args('input') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    async findOne(@Args('input') input: FindUserInput): Promise<User> {
        return this.userService.findOne(input);
    }


    @Mutation(() => Boolean, { name: 'deleteUser' })
    async removeUser(@Args('input') input: DeleteUserInput) {
        return await this.userService.remove(input);
    }

    //TODO: add this for pagination
    // @Query(() => [User], { name: 'users' })
    // findAll(@Args('input') paginationQuery?: PaginationInput) {
    //     return this.usersService.findAll(paginationQuery);
    // }


    // @Mutation(() => User, { name: 'updateUser' })
    // updateUser(@Args('input') updateUserInput: UpdateUserInput) {
    //     return this.usersService.update(updateUserInput);
    // }
}

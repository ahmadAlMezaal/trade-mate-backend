import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { CreateUserInput } from './dto/createUser.input';
import { DeleteUserInput, UpdateUserInput } from './dto/updateUser.input';
import { FindUserInput } from './dto/findOne.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { PostService } from 'src/post/post.service';
import { ObjectId } from 'mongodb';
import { Post } from 'src/post/entities/post.schema';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly userService: UsersService,
        private readonly postService: PostService
    ) { }

    @Query(() => User, { name: 'profile' })
    @UseGuards(JwtAuthGuard)
    public me(@CurrentUser() user: User): User {
        return user
    }

    @Query(() => [Post], { name: 'bookmarks' })
    @UseGuards(JwtAuthGuard)
    public async getBookmarkedPosts(@CurrentUser() user: User) {
        const ids: ObjectId[] = user.bookmarkedPostIds.map(_id => new ObjectId(_id))
        return this.postService.getPostsByIds(ids);
    }

    @Mutation(() => User, { name: 'updateUserBookmarks' })
    @UseGuards(JwtAuthGuard)
    public async updateUserBookmarks(@CurrentUser() user: User, @Args('postId') postId: string) {
        try {
            return this.userService.updateBookmarkedPosts(user, postId);
        } catch (error) {
            console.log('error: ', error);
        }
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

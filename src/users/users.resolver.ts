import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { DeleteUserInput } from './dto/updateUser.input';
import { FindSingleUserInput, FindUserInput } from './dto/findOne.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { PostService } from 'src/post/post.service';
import { ObjectId } from 'mongodb';
import { Post } from 'src/post/entities/post.schema';
import { Proposal } from 'src/proposal/entities/proposal.schema';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly userService: UsersService,
        private readonly postService: PostService
    ) { }

    @Query(() => User, { name: 'profile' })
    @UseGuards(JwtAuthGuard)
    public getLoggedInUser(@CurrentUser() user: User): User {
        return user;
    }

    @Query(() => User, { name: 'info' })
    @UseGuards(JwtAuthGuard)
    public async getUserInfo(@Args('input') input: FindSingleUserInput) {
        input._id = new ObjectId(input._id);
        return this.userService.findOne(input);
    }

    @Query(() => [Post], { name: 'bookmarks' })
    @UseGuards(JwtAuthGuard)
    public async getBookmarkedPosts(@CurrentUser() user: User) {
        const ids: ObjectId[] = user.bookmarkedPostIds?.map(_id => new ObjectId(_id))
        return this.postService.getPostsByIds(ids);
    }

    @Query(() => [Proposal], { name: 'proposals' })
    @UseGuards(JwtAuthGuard)
    public async getUserProposals(@CurrentUser() user: User) {
        return await this.userService.getUserProposals(user._id.toString());
    }

    @Mutation(() => User, { name: 'updateUserBookmarks' })
    @UseGuards(JwtAuthGuard)
    public async updateUserBookmarks(@CurrentUser() user: User, @Args('postId') postId: string) {
        return await this.userService.updateBookmarkedPosts(user, postId);
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

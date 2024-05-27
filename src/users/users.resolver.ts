import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.schema';
import { DeleteUserInput } from './dto/updateUser.input';
import { FindSingleUserInput, FindUserInput } from './dto/findOne.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { Listing } from 'src/listing/entities/listing.schema';
import { Proposal } from 'src/proposal/entities/proposal.schema';
import { ConnectionStatus } from 'src/notifications/entities/notification.schema';
import { ListingService } from 'src/listing/listing.service';
import { Types } from 'mongoose';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly userService: UsersService,
        private readonly listingService: ListingService
    ) { }

    @Query(() => User, { name: 'profile' })
    @UseGuards(JwtAuthGuard)
    public getLoggedInUser(@CurrentUser() user: User): User {
        return user;
    }

    // @Query(() => User, { name: 'profile' })
    // @UseGuards(JwtAuthGuard)
    // public getLoggedInUser(@CurrentUser() user: User): User {
    //     return user;
    // }

    @Query(() => User, { name: 'info' })
    @UseGuards(JwtAuthGuard)
    public async getUserInfo(@Args('input') input: FindSingleUserInput) {
        input._id = new Types.ObjectId(input._id);
        return this.userService.getUser(input);
    }

    @Query(() => [Listing], { name: 'bookmarks' })
    @UseGuards(JwtAuthGuard)
    public async getBookmarkedListings(@CurrentUser() user: User) {
        const ids: Types.ObjectId[] = user.bookmarkedListingIds?.map(_id => new Types.ObjectId(_id));
        return this.listingService.getListingsByIds(ids);
    }

    @Query(() => [Proposal], { name: 'proposals' })
    @UseGuards(JwtAuthGuard)
    public async getUserProposals(@CurrentUser() user: User) {
        return await this.userService.getUserProposals(user._id.toString());
    }

    @Mutation(() => User, { name: 'updateUserBookmarks' })
    @UseGuards(JwtAuthGuard)
    public async updateUserBookmarks(@CurrentUser() user: User, @Args('listingId') listingId: string) {
        return await this.userService.updateBookmarkedListings(user, listingId);
    }

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    async findOne(@Args('input') input: FindUserInput): Promise<User> {
        return this.userService.getUser(input);
    }

    @Mutation(() => Boolean, { name: 'deleteUser' })
    async removeUser(@Args('input') input: DeleteUserInput) {
        return await this.userService.remove(input);
    }

    @Mutation(() => User, { name: 'sendConnectionRequest' })
    @UseGuards(JwtAuthGuard)
    async sendUserConnectionsRequest(
        @CurrentUser() user: User,
        @Args("connectionId", { type: () => String }) connectionId: string,
    ) {
        return await this.userService.sendConnectionRequest(user, connectionId);
    }

    @Mutation(() => Boolean, { name: 'respondToConnection' })
    @UseGuards(JwtAuthGuard)
    async connectWithUser(
        @CurrentUser() user: User,
        @Args("connectionId", { type: () => String }) connectionId: string,
        @Args("status", { type: () => String }) status: ConnectionStatus,
    ) {
        return await this.userService.respondToConnectionRequest(user, connectionId, status);
    }

    @Query(() => [User], { name: 'connectionsProfiles' })
    async fetchConnectionsProfiles(@Args('userId') userId: string): Promise<User[]> {
        return await this.userService.getConnections(userId);
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

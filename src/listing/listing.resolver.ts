import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListingService } from './listing.service';
import { Listing } from './entities/listing.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ObjectId } from 'mongodb';
import { ProductCondition } from 'src/types/enums';

@Resolver(() => Listing)
export class ListingResolver {
    constructor(
        private readonly listingService: ListingService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => String, { name: 'addListing' })
    async addListing(
        @Args('availableBookId', { type: () => String }) availableBookId: string,
        @Args('desiredBookId', { type: () => String }) desiredBookId: string,
        @Args('file', { type: () => GraphQLUpload }) fileUpload: FileUpload,
        @Args('productCondition', { type: () => String }) productCondition: ProductCondition,
        @Args('description', { type: () => String }) description: string,
        @CurrentUser() user: User
    ) {
        return await this.listingService.addListing(user, availableBookId, desiredBookId, fileUpload, productCondition, description);
    }

    @Query(() => [Listing], { name: 'listings' })
    async getAllListings(): Promise<Listing[]> {
        return await this.listingService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Listing], { name: 'feed' })
    async getFeed(@CurrentUser() user: User): Promise<Listing[]> {
        return await this.listingService.fetchFeed(user._id);
    }

    @Query(() => Listing, { name: 'listing' })
    public async findOne(@Args('_id', { type: () => String }) _id: string) {
        return await this.listingService.findOne({ _id: new ObjectId(_id) });
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Listing], { name: 'userListings' })
    async getUserListing(@Args("_id", { type: () => String }) _id: string): Promise<Listing[]> {
        return await this.listingService.fetchUserListing(_id);
    }
}

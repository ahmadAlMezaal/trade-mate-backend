import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.schema';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ObjectId } from 'mongodb';
import { ProductCondition } from 'src/types/enums';

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Boolean, { name: 'addPost' })
    async addPost(
        @Args('availableBookId', { type: () => String }) availableBookId: string,
        @Args('desiredBookId', { type: () => String }) desiredBookId: string,
        @Args('file', { type: () => GraphQLUpload }) fileUpload: FileUpload,
        @Args('productCondition', { type: () => String }) productCondition: ProductCondition,
        @Args('description', { type: () => String }) description: string,
        @CurrentUser() user: User
    ) {
        try {
            await this.postService.addPost(user, availableBookId, desiredBookId, fileUpload, productCondition, description);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    @Query(() => [Post], { name: 'posts' })
    async getAllPosts(): Promise<Post[]> {
        return await this.postService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Post], { name: 'feed' })
    async getFeed(@CurrentUser() user: User): Promise<Post[]> {
        return await this.postService.fetchFeed(user._id);
    }

    @Query(() => Post, { name: 'post' })
    findOne(@Args('id', { type: () => Int }) _id: string) {
        return this.postService.findOne({ _id: new ObjectId(_id) });
    }

}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.schema';
import { CreatePostInput } from './dto/createPost.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ObjectId } from 'mongodb';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/types/models';


@Resolver(() => Post)
export class PostResolver {
    constructor(private readonly postService: PostService) { }

    @Mutation(() => Boolean)
    async uploadFile(
        @Args({ name: 'file', type: () => GraphQLUpload }) { createReadStream, filename }: FileUpload
    ) {
        /** now you have the file as a stream **/
    }
    @Mutation(() => Post, { name: 'addPost' })
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Args('input') createPostInput: CreatePostInput,
        // @Args({ name: 'imageUrls', type: () => [GraphQLUpload] }) imageUrls: Array<Express.Multer.File>,
        @Args({ name: 'imageUrls', type: () => GraphQLUpload }) imageUrls: FileUpload,
        @CurrentUser() user: User
    ): Promise<ObjectId> {
        console.log('images: ', imageUrls);
        return await this.postService.create(createPostInput, user);
    }

    @Query(() => [Post], { name: 'posts' })
    async getAllPosts(): Promise<Post[]> {
        return await this.postService.findAll();
    }

    @Query(() => Post, { name: 'post' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.postService.findOne(id);
    }

    @Mutation(() => Post)
    updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
        return this.postService.update(updatePostInput.id, updatePostInput);
    }

    @Mutation(() => Post)
    removePost(@Args('id', { type: () => Int }) id: number) {
        return this.postService.remove(id);
    }
}

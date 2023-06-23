import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.schema';
import { CreatePostInput } from './dto/createPost.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { ObjectId } from 'mongodb';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { AwsService } from 'src/aws/aws.service';

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly awsService: AwsService,
    ) { }

    //* https://stackoverflow.com/questions/75744174/how-to-upload-images-in-nestjs-with-graphql
    @Mutation(() => Boolean)
    async uploadFile(
        @Args({ name: 'file', type: () => GraphQLUpload }) { createReadStream, filename }: FileUpload,
    ) {
        try {
            await this.awsService.uploadFile(createReadStream, filename);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    @Mutation(() => Post, { name: 'addPost' })
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Args('input') createPostInput: CreatePostInput,
        @CurrentUser() user: User
    ): Promise<ObjectId> {
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

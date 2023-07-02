import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.schema';
import { InternalServerErrorException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { ObjectId } from 'mongodb';

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
    ) { }

    //* https://stackoverflow.com/questions/75744174/how-to-upload-images-in-nestjs-with-graphql
    @Mutation(() => Boolean, { name: 'addPost' })
    @UseGuards(JwtAuthGuard)
    async addPost(
        @Args({ name: 'file', type: () => GraphQLUpload }) fileUpload: FileUpload,
        @Args('title', { type: () => String }) title: string,
        @Args('bookId', { type: () => String }) bookId: string,
        @Args('description', { type: () => String }) description: string,
        @CurrentUser() user: User
    ) {
        try {
            await this.postService.addPost(user, fileUpload, title, description, bookId);
            return true;
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    @Query(() => [Post], { name: 'posts' })
    async getAllPosts(): Promise<Post[]> {
        return await this.postService.findAll();
    }

    @Query(() => Post, { name: 'post' })
    findOne(@Args('id', { type: () => Int }) _id: string) {
        return this.postService.findOne({ _id: new ObjectId(_id) });
    }

    @Mutation(() => Post)
    removePost(@Args('id', { type: () => Int }) id: number) {
        return this.postService.remove(id);
    }
}

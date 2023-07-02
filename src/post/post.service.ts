import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.schema';
import { CreatePostInput } from './dto/createPost.input';
import { Post } from './entities/post.schema';
import { AwsService } from 'src/aws/aws.service';
import { FileUpload } from 'graphql-upload';

@Injectable()
export class PostService {

    constructor(
        @Inject('POSTS_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService,
        private readonly awsService: AwsService,

    ) { }

    private get collection(): Collection<Post> {
        return this.db.collection<Post>('posts');
    }

    private async createOne(createPostInput: CreatePostInput, userId: ObjectId): Promise<any> {
        const { title, description, imageUrls, bookId } = createPostInput;
        console.log('createPostInput: ', createPostInput);
        const bookInfo = await this.bookService.getBookByProviderId(bookId);
        const postId = await this.collection.insertOne(
            {
                title,
                bookInfo,
                description,
                imageUrls,
                postOwnerId: userId,
            }
        );
        return { _id: postId.insertedId };
    }

    public async addPost(user: User, fileUpload: FileUpload, title: string, description: string, bookId: string) {
        const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);
        const newPostInfo: CreatePostInput = { title, description, imageUrls: [imageUrl], bookId }
        this.createOne(newPostInfo, user._id)
    }

    public async findAll(): Promise<Post[]> {
        return await this.collection.find({}).toArray();
    }

    public async getPostsByIds(_ids: ObjectId[]) {
        return await this.collection.find({ _id: { $in: _ids } }).toArray();
    }

    public async findOne(params: Partial<Post>) {
        return await this.collection.findOne({ ...params });
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}

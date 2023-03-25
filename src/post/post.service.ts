import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/schemas/user.schema';
import { CreatePostInput } from './dto/createPost.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.schema';

@Injectable()
export class PostService {

    constructor(
        @Inject('POSTS_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService
    ) { }

    private get collection(): Collection<Post> {
        return this.db.collection<Post>('posts');
    }

    async create(createPostInput: CreatePostInput, user: User): Promise<any> {
        const { title, description } = createPostInput
        const imageUrls = []
        const bookInfo = this.bookService.findAll()[0]
        const postId = await this.collection.insertOne(
            {
                title,
                bookInfo,
                description,
                imageUrls,
                postOwnerId: user._id,
            }
        )
        return { _id: postId.insertedId }
    }

    public async findAll() {
        // const tst = await this.collection.find({ _id: new ObjectId('640348d047014a48505931be') })
        // console.log('tst: ', tst);
        return await this.collection.find({}).toArray();
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostInput: UpdatePostInput) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}

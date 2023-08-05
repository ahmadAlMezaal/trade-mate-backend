import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.schema';
import { CreatePostInput } from './dto/createPost.input';
import { Post } from './entities/post.schema';
import { AwsService } from 'src/aws/aws.service';
import { FileUpload } from 'graphql-upload';
import { ProposalStatus, PostStatus, ProductCondition } from 'src/types/enums';

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
        const { description, imageUrls, availableBookId, desiredBookId, productCondition } = createPostInput;
        const [offeredBookInfo, desiredBookInfo] = await Promise.all(
            [
                this.bookService.getBookByProviderId(availableBookId),
                this.bookService.getBookByProviderId(desiredBookId)
            ]
        );

        const postId = await this.collection.insertOne(
            {
                title: `Trade ${offeredBookInfo.title} for ${desiredBookInfo.title}`,
                offeredBookInfo,
                desiredBookInfo,
                description,
                imageUrls,
                postOwnerId: userId,
                productCondition,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
        return { _id: postId.insertedId };
    }

    public async addPost(user: User, availableBookId: string, desiredBookId: string, fileUpload: FileUpload, productCondition: ProductCondition, description: string) {
        try {
            const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);
            const newPostInfo: CreatePostInput = {
                description,
                imageUrls: [imageUrl],
                productCondition,
                availableBookId,
                desiredBookId
            };
            const defaults: Partial<Post> = {
                proposalsIds: [],
                status: PostStatus.PENDING,
            }
            return await this.createOne({ ...newPostInfo, ...defaults }, user._id)
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    public async findAll(): Promise<Post[]> {
        return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    public async fetchFeed(_id: ObjectId): Promise<Post[]> {
        return await this.collection.find(
            {
                postOwnerId: { $ne: new ObjectId(_id) },
                status: { $in: [PostStatus.OPEN, PostStatus.APPROVED] },
            }
        )
            .sort({ createdAt: -1 })
            .toArray();
    }

    public async fetchUserListing(_id: ObjectId): Promise<Post[]> {
        return await this.collection.find({ postOwnerId: _id }).sort({ createdAt: -1 }).toArray();
    }

    public async getPostsByIds(_ids: ObjectId[]) {
        return await this.collection.find({ _id: { $in: _ids } }).toArray();
    }

    public async findOne(params: Partial<Post>) {
        return await this.collection.findOne({ ...params });
    }

    public async pushProposalId(listingIdStr: string, proposalIdStr: string) {
        const _id = new ObjectId(listingIdStr);
        const proposalId = new ObjectId(proposalIdStr);

        const result = await this.collection.findOneAndUpdate(
            { _id },
            {
                $push: { proposalsIds: proposalId },
                $currentDate: { updatedAt: true },
            },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new NotFoundException('Post not found');
        }
        return result.value;
    }

    public async updateListingStatus(listingIdStr: string, status: PostStatus) {
        const _id = new ObjectId(listingIdStr);

        const result = await this.collection.findOneAndUpdate(
            { _id },
            {
                $set: { status },
                $currentDate: { updatedAt: true },
            },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            throw new NotFoundException('Post not found');
        }
        return result.value;
    }

}

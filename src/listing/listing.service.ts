import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.schema';
import { CreateListingInput } from './dto/createListing.input';
import { Listing } from './entities/listing.schema';
import { AwsService } from 'src/aws/aws.service';
import { FileUpload } from 'graphql-upload';
import { ListingStatus, ProductCondition } from 'src/types/enums';

@Injectable()
export class ListingService {

    constructor(
        @Inject('LISTING_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService,
        private readonly awsService: AwsService,
    ) { }

    private get collection(): Collection<Listing> {
        return this.db.collection<Listing>('listings');
    }

    private async createOne(createListingInput: CreateListingInput, userId: ObjectId): Promise<ObjectId> {
        const { description, imageUrls, availableBookId, desiredBookId, productCondition } = createListingInput;
        const [offeredBookInfo, desiredBookInfo] = await Promise.all(
            [
                this.bookService.getBookByProviderId(availableBookId),
                this.bookService.getBookByProviderId(desiredBookId)
            ]
        );
        const defaults: Partial<Listing> = {
            proposalsIds: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            status: ListingStatus.PENDING
        }
        const listingId = await this.collection.insertOne(
            {
                title: `Trade ${offeredBookInfo.title} for ${desiredBookInfo.title}`,
                offeredBookInfo,
                desiredBookInfo,
                description,
                imageUrls,
                listingOwnerId: userId,
                productCondition,
                ...defaults,
            }
        );
        return listingId.insertedId;
    }

    public async addListing(user: User, availableBookId: string, desiredBookId: string, fileUpload: FileUpload, productCondition: ProductCondition, description: string) {
        try {
            const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);
            const newListingInfo: CreateListingInput = {
                description,
                imageUrls: [imageUrl],
                productCondition,
                availableBookId,
                desiredBookId
            };
            return await this.createOne(newListingInfo, user._id)
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    public async findAll(): Promise<Listing[]> {
        return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
    }

    public fetchFeed(_id: ObjectId): Promise<Listing[]> {
        return this.collection.find(
            {
                listingOwnerId: { $ne: new ObjectId(_id) },
                status: { $in: [ListingStatus.OPEN, ListingStatus.APPROVED] },
            }
        )
            .sort({ createdAt: -1 })
            .toArray();
    }

    public async fetchUserListing(_id: string): Promise<Listing[]> {
        return await this.collection.find({ listingOwnerId: new ObjectId(_id) }).sort({ createdAt: -1 }).toArray();
    }

    public async getListingsByIds(_ids: ObjectId[]) {
        return await this.collection.find({ _id: { $in: _ids } }).toArray();
    }

    public findOne(params: Partial<Listing>) {
        return this.collection.findOne({ ...params });
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
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

    public async updateListingStatus(listingIdStr: string, status: ListingStatus) {
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
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

}

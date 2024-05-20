import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.schema';
import { CreateListingInput } from './dto/createListing.input';
import { Listing, ListingDocument } from './entities/listing.schema';
import { AwsService } from 'src/aws/aws.service';
import { FileUpload } from 'graphql-upload';
import { ListingStatus, ProductCondition } from 'src/types/enums';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ListingService {

    constructor(
        @InjectModel(Listing.name) private readonly listingsCollection: Model<ListingDocument>,
        private readonly bookService: BooksService,
        private readonly awsService: AwsService,
    ) { }

    private async createOne(createListingInput: CreateListingInput, userId: Types.ObjectId): Promise<Types.ObjectId> {
        const { description, imageUrls, availableBookId, desiredBookId, productCondition } = createListingInput;
        const [offeredBookInfo, desiredBookInfo] = await Promise.all(
            [
                this.bookService.getBookByProviderId(availableBookId),
                this.bookService.getBookByProviderId(desiredBookId)
            ]
        );
        const defaults: Partial<Listing> = {
            proposalsIds: [],
            status: ListingStatus.PENDING
        };
        const listing = new Listing(
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
        const newListing = await listing.save();
        return newListing._id;
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
            return await this.createOne(newListingInfo, user._id);
        } catch (error) {
            throw new InternalServerErrorException('Error uploading file');
        }
    }

    public async findAll(): Promise<Listing[]> {
        return await this.listingsCollection.find({}).sort({ createdAt: -1 });
    }

    public fetchFeed(_id: Types.ObjectId): Promise<Listing[]> {
        return this.listingsCollection.find(
            {
                listingOwnerId: { $ne: new Types.ObjectId(_id) },
                status: { $in: [ListingStatus.OPEN, ListingStatus.APPROVED] },
            }
        )
            .sort({ createdAt: -1 });
    }

    public async fetchUserListing(_id: string): Promise<Listing[]> {
        return await this.listingsCollection.find({ listingOwnerId: new Types.ObjectId(_id) }).sort({ createdAt: -1 });
    }

    public async getListingsByIds(_ids: Types.ObjectId[]) {
        return await this.listingsCollection.find({ _id: { $in: _ids } });
    }

    public findOne(params: FilterQuery<Listing>) {
        return this.listingsCollection.findOne({ ...params });
    }

    public async pushProposalId(listingIdStr: string, proposalIdStr: string) {
        const _id = new Types.ObjectId(listingIdStr);
        const proposalId = new Types.ObjectId(proposalIdStr);

        const result = await this.listingsCollection.findOneAndUpdate(
            { _id },
            {
                $push: { proposalsIds: proposalId },
                // $currentDate: { updatedAt: true },
            },
            {
                new: true,
                rawResult: true,
                includeResultMetadata: true
            }
        );

        if (!result.value) {
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

    public async updateListingStatus(listingIdStr: string, status: ListingStatus) {
        const _id = new Types.ObjectId(listingIdStr);

        const result = await this.listingsCollection.findOneAndUpdate(
            { _id },
            {
                $set: { status },
                $currentDate: { updatedAt: true },
            },
            {
                new: true,
                rawResult: true,
                includeResultMetadata: true
            }
        );

        if (!result.value) {
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

}

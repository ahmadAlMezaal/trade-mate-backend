import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { User } from 'src/users/entities/user.schema';
import { BookPriorityInput, CreateListingInput } from './dto/createListing.input';
import { Listing, ListingDocument } from './entities/listing.schema';
import { AwsService } from 'src/aws/aws.service';
import { FileUpload } from 'graphql-upload';
import { ListingStatus, ProductCondition } from 'src/types/enums';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IBook } from 'src/types/models';

@Injectable()
export class ListingService {

    constructor(
        @InjectModel(Listing.name) private readonly listingsCollection: Model<ListingDocument>,
        private readonly bookService: BooksService,
        private readonly awsService: AwsService,
    ) { }

    private async createOne(createListingInput: CreateListingInput, userId: Types.ObjectId): Promise<Types.ObjectId> {
        const { description, imageUrls, books, productCondition } = createListingInput;

        const promises = books.map((book) => this.bookService.getBookByProviderId(book.bookId));
        const results = await Promise.allSettled(promises);

        const booksInfo = results
            .filter((result): result is PromiseFulfilledResult<IBook> => result.status === 'fulfilled')
            .map(result => result.value);

        const offeredBookInfo = booksInfo.splice(0, 1)[0];

        const desiredBooksMap: { [priority: number]: IBook } = {};

        books
            .slice(1)
            .forEach(
                (book, index) => {
                    desiredBooksMap[book.priority] = booksInfo[index];
                }
            );

        const listing = new this.listingsCollection(
            {
                title: `Trade ${offeredBookInfo.title}`,
                offeredBookInfo,
                desiredBooks: desiredBooksMap,
                description,
                imageUrls,
                listingOwnerId: userId,
                productCondition,
            }
        );

        const newListing = await listing.save();
        return newListing._id;
    }

    public async addListing(user: User, listingBooks: BookPriorityInput[], filesUpload: FileUpload[], productCondition: ProductCondition, description: string) {
        const imageUrls = [];
        try {
            const resolvedFiles = await Promise.all(filesUpload);
            for (const fileUpload of resolvedFiles) {
                const imageUrl = await this.awsService.uploadFile(
                    fileUpload.createReadStream,
                    fileUpload.filename
                );
                imageUrls.push(imageUrl);
            }

            const newListingInfo: CreateListingInput = {
                description,
                imageUrls,
                productCondition,
                books: listingBooks,
            };
            await this.createOne(newListingInfo, user._id);
            return { message: 'Your listing has been uploaded successfully and will be checked by an admin for approval.' };
        } catch (error) {
            throw new InternalServerErrorException('Error creating your listing file');
        }
    }

    public async findAll(): Promise<Listing[]> {
        return await this.listingsCollection.find({}).sort({ createdAt: -1 });
    }

    public async fetchFeed(_id: Types.ObjectId): Promise<Listing[]> {
        return this.listingsCollection.find(
            {
                listingOwnerId: { $ne: new Types.ObjectId(_id) },
                status: { $in: [ListingStatus.OPEN, ListingStatus.APPROVED] },
            }
        )
            .sort({ createdAt: -1 })
            .lean();
    }

    public async fetchUserListing(_id: string): Promise<Listing[]> {
        return this.listingsCollection
            .find({ listingOwnerId: new Types.ObjectId(_id) })
            .sort({ createdAt: -1 });
    }

    public async getListingsByIds(_ids: Types.ObjectId[]) {
        return this.listingsCollection.find({ _id: { $in: _ids } });
    }

    public async findOne(params: FilterQuery<Listing>) {
        return this.listingsCollection.findOne({ ...params });
    }

    public async pushProposalId(listingIdStr: string, proposalIdStr: string) {
        const _id = new Types.ObjectId(listingIdStr);
        const proposalId = new Types.ObjectId(proposalIdStr);

        const result = await this.listingsCollection.findOneAndUpdate(
            { _id },
            {
                $push: { proposalsIds: proposalId },
            },
            {
                new: true,
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
                includeResultMetadata: true
            }
        );

        if (!result.value) {
            throw new NotFoundException('Listing not found');
        }
        return result.value;
    }

}

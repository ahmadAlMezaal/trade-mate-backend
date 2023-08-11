import { Book } from 'src/books/entities/book.schema';
import { ListingStatus } from 'src/types/enums';

export class IListing {
    _id: string;
    title: string;
    description: string;
    imageUrls: string[];
    bookInfo: Book;
    listingOwnerId: string;
    status?: ListingStatus;
    offeredBookInfo: Book;
    proposalsIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

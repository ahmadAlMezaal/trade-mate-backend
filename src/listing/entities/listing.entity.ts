import { Book } from 'src/books/entities/book.schema';
import { ListingStatus, ProductCondition } from 'src/types/enums';

export class IListing {
    _id: string;
    title?: string;
    description: string;
    imageUrls: string[];
    offeredBookInfo: Book;
    desiredBooks: Book[];
    listingOwnerId: string;
    productCondition: ProductCondition;
    status?: ListingStatus;
    proposalsIds?: string[];
}

import { Book } from 'src/books/entities/book.schema';
import { ListingStatus, ProductCondition } from 'src/types/enums';
import { ObjectType, Field } from '@nestjs/graphql';

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

@ObjectType()
export class AddListingResponse {
    @Field()
    message: string;
}

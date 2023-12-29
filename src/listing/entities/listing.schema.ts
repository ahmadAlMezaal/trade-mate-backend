import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Book } from 'src/books/entities/book.schema';
import { Timestamps } from 'src/common/schemas/timestamps.schema';
import { ListingStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
export class Listing extends Timestamps {

    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'Title of the listing' })
    title?: string;

    @Field(() => String, { description: 'description of the listing' })
    description: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => Book, { description: 'Contains information about the book that the user is offering.' })
    offeredBookInfo: Book;

    @Field(() => Book, { description: 'Contains information about the requested book.' })
    desiredBookInfo: Book;

    @Field(() => ID)
    listingOwnerId: ObjectId;

    @Field(() => String, { description: 'The language of the book' })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Used for the admin to approve the listing' })
    status?: ListingStatus;

    @Field(() => [ID], { description: 'IDs of the proposals received' })
    proposalsIds?: ObjectId[];

}

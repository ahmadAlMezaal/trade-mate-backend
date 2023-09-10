import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Book } from 'src/books/entities/book.schema';
import { Timestamps } from 'src/common/schemas/timestamps.schema';
import { ProposalStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
export class Proposal extends Timestamps {

    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'Title of the proposal', })
    title?: string;

    @Field(() => String, { description: 'description of the proposal' })
    additionalInfo: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => ID)
    senderId: ObjectId;

    @Field(() => ID)
    recepientId: ObjectId;

    @Field(() => ID)
    listingId: ObjectId;

    @Field(() => Book, { description: 'Contains information about the item offered by the trader.' })
    offeredItem: Book;

    @Field(() => Book, { description: 'Contains information about the item that the trader wants to trade for.' })
    desiredItem: Book;

    @Field(() => String, { description: 'The language of the book' })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Status of the proposal' })
    status?: ProposalStatus;

}

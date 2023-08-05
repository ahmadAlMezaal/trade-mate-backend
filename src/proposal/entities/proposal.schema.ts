import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Book } from 'src/books/entities/book.schema';
import { ProposalStatus, PostStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
export class Proposal {

    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'Title of the proposal', })
    title?: string;

    @Field(() => String, { description: 'description of the proposal' })
    additionalInfo: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => ID)
    userId: ObjectId;

    @Field(() => ID)
    listingId: ObjectId;

    @Field(() => Book, { description: 'Contains information about the requested book.' })
    item: Book;

    @Field(() => Date, { description: 'The date when the proposal was created' })
    createdAt?: Date;

    @Field(() => Date, { description: 'The last date when the proposal was updated' })
    updatedAt?: Date;

    @Field(() => String, { description: 'The language of the book' })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Status of the proposal' })
    status?: ProposalStatus;

}

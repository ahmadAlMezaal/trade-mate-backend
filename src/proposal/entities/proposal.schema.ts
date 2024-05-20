import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/books/entities/book.schema';
import { ProposalStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
@Schema({ timestamps: true })
export class Proposal extends Document {

    @Field(() => ID)
    _id?: Types.ObjectId;

    @Field(() => String, { description: 'Title of the proposal', })
    title?: string;

    @Field(() => String, { description: 'description of the proposal' })
    additionalInfo: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => ID)
    senderId: Types.ObjectId;

    @Field(() => ID)
    recipientId: Types.ObjectId;

    @Field(() => ID)
    listingId: Types.ObjectId;

    @Field(() => Book, { description: 'Contains information about the item offered by the trader.' })
    offeredItem: Book;

    @Field(() => Book, { description: 'Contains information about the item that the trader wants to trade for.' })
    desiredItem: Book;

    @Field(() => String, { description: 'The language of the book' })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Status of the proposal' })
    status?: ProposalStatus;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);

export type ProposalDocument = HydratedDocument<Proposal>;
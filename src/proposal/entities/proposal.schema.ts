import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/books/entities/book.schema';
import { ProposalStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
@Schema({ timestamps: true })
export class Proposal extends Document {

    @Field(() => ID)
    _id?: Types.ObjectId;

    @Field(() => String, { description: 'Title of the proposal', })
    @Prop({ type: String })
    title: string;

    @Field(() => String, { description: 'description of the proposal' })
    @Prop({ type: String })
    additionalInfo: string;

    @Field(() => [String], { description: 'Images of the book' })
    @Prop({ type: [String] })
    imageUrls: string[];

    @Field(() => ID)
    @Prop({ type: Types.ObjectId })
    senderId: Types.ObjectId;

    @Field(() => ID)
    @Prop({ type: Types.ObjectId })
    recipientId: Types.ObjectId;

    @Field(() => ID)
    @Prop({ type: Types.ObjectId })
    listingId: Types.ObjectId;

    @Field(() => Book, { description: 'Contains information about the item offered by the trader.' })
    @Prop({ type: Book })
    offeredItem: Book;

    @Field(() => Book, { description: 'Contains information about the item that the trader wants to trade for.' })
    @Prop({ type: Book })
    desiredItem: Book;

    @Field(() => String, { description: 'The language of the book' })
    @Prop({ type: String })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Status of the proposal' })
    @Prop({ type: String, default: ProposalStatus.PENDING })
    status: ProposalStatus;

    @Field(() => Date, { description: 'The date when the entity was created' })
    @Prop({ type: Date })
    createdAt?: Date;

    @Field(() => Date, { description: 'The last date when the entity was updated' })
    @Prop({ type: Date })
    updatedAt?: Date;
}

export const ProposalSchema = SchemaFactory.createForClass(Proposal);

export type ProposalDocument = HydratedDocument<Proposal>;
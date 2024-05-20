import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/books/entities/book.schema';
import { ListingStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
@Schema({ timestamps: true })
export class Listing extends Document {

    @Field(() => ID)
    _id?: Types.ObjectId;

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
    listingOwnerId: Types.ObjectId;

    @Field(() => String, { description: 'The language of the book' })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Used for the admin to approve the listing' })
    status?: ListingStatus;

    @Field(() => [ID], { description: 'IDs of the proposals received' })
    proposalsIds?: Types.ObjectId[];

}

export const ListingSchema = SchemaFactory.createForClass(Listing);

export type ListingDocument = HydratedDocument<Listing>;
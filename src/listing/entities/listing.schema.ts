import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSON } from 'graphql-type-json';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Book } from 'src/books/entities/book.schema';
import { ListingStatus, ProductCondition } from 'src/types/enums';

@ObjectType()
export class BookWithPriority {

    @Field(() => String)
    priority: string;

    @Field(() => Book)
    book: Book;
}

@ObjectType()
@Schema({ timestamps: true })
export class Listing extends Document {

    @Field(() => ID)
    _id?: Types.ObjectId;

    @Field(() => String, { description: 'Title of the listing' })
    @Prop({ type: String })
    title?: string;

    @Field(() => String, { description: 'description of the listing' })
    @Prop({ type: String })
    description: string;

    @Field(() => [String], { description: 'Images of the book' })
    @Prop({ type: Array })
    imageUrls: string[];

    @Field(() => Book, { description: 'Contains information about the book that the user is offering.' })
    @Prop({ type: Object })
    offeredBookInfo: Book;

    @Field(() => GraphQLJSON, { description: 'Contains information about the requested books, mapped by priority.' })
    @Prop({ type: Object })
    desiredBooks: { [priority: string]: Book };

    @Field(() => ID)
    @Prop({ type: Object })
    listingOwnerId: Types.ObjectId;

    @Field(() => String, { description: 'The condition of the book' })
    @Prop({ type: String })
    productCondition: ProductCondition;

    @Field(() => String, { description: 'Used for the admin to approve the listing' })
    @Prop({ type: String, default: ListingStatus.PENDING })
    status?: ListingStatus;

    @Field(() => [ID], { description: 'IDs of the proposals received' })
    @Prop({ type: Object, default: [] })
    proposalsIds?: Types.ObjectId[];

}

export const ListingSchema = SchemaFactory.createForClass(Listing);

export type ListingDocument = HydratedDocument<Listing>;
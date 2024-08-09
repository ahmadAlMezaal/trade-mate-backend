import { Field, ObjectType } from "@nestjs/graphql";
import { ImageUrls } from "./imageUrls.input";
import { Document, HydratedDocument } from "mongoose";
import { Prop, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
export class Book extends Document {

    @Field(() => String)
    @Prop({ type: String, required: true })
    providerId: string;

    @Field(() => String, { description: 'Official name of the book' })
    @Prop({ type: String, required: true })
    title: string;

    @Field(() => String, { description: 'Official subtitle of the book', nullable: true })
    @Prop({ type: String })
    subtitle?: string;

    @Field(() => [String], { description: 'Authors of the book', defaultValue: [], nullable: true })
    @Prop({ type: [String] })
    authors: string[];

    @Field(() => String, { description: 'Description of the book', nullable: true })
    @Prop({ type: String, required: true })
    description: string;

    @Field(() => ImageUrls, { description: 'description of the book', defaultValue: [], nullable: true })
    @Prop()
    imageUrls: ImageUrls;

    @Field(() => Number, { description: 'The total page count of the book' })
    @Prop({ type: Number, required: true })
    totalPageCount: number;

    @Field(_type => [String], { description: 'Categories of the book', defaultValue: [] })
    @Prop({ type: [String], required: true })
    genres: string[];

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    @Prop({ type: String })
    language?: string;

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    @Prop({ type: String })
    pdfLink?: string;

}

export const BookSchema = SchemaFactory.createForClass(Book);

export type BookDocument = HydratedDocument<Book>;
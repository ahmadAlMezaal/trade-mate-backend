import { Field, ObjectType } from "@nestjs/graphql";
import { ImageUrls } from "./imageUrls.input";
import { Document, HydratedDocument } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
@Schema({ timestamps: true })
export class Book extends Document {

    @Field(() => String)
    providerId: string;

    @Field(() => String, { description: 'Official name of the book' })
    title: string;

    @Field(() => String, { description: 'Official subtitle of the book', nullable: true })
    subtitle?: string;

    @Field(() => [String], { description: 'Authors of the book', defaultValue: [], nullable: true })
    authors: string[];

    @Field(() => String, { description: 'Description of the book', nullable: true })
    description: string;

    @Field(() => ImageUrls, { description: 'description of the book', defaultValue: [], nullable: true })
    imageUrls: ImageUrls;

    @Field(() => Number, { description: 'The total page count of the book' })
    totalPageCount: number;

    @Field(_type => [String], { description: 'Categories of the book', defaultValue: [] })
    genres: string[];

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    language?: string;

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    pdfLink?: string;

}

export const BookSchema = SchemaFactory.createForClass(Book);

export type BookDocument = HydratedDocument<Book>;
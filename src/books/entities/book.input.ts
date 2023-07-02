import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { ImageUrls } from "./imageUrls.input";

@ObjectType()
@InputType('BookInput')
export class BookInput {

    @Field(() => String)
    providerId: string;

    @Field(() => String)
    title: string;

    @Field(() => String)
    subtitle?: string;

    @Field(() => [String], { description: 'Authors of the book', defaultValue: [], nullable: true })
    authors: string[];

    @Field(() => String, { description: 'Description of the book', nullable: true })
    description: string;

    @Field(() => ImageUrls, { description: 'description of the book', defaultValue: [], nullable: true })
    imageUrls: ImageUrls;

    @Field(() => Number, { description: 'The total page count of the book' })
    totalPageCount: number

    @Field(_type => [String], { description: 'Categories of the book', defaultValue: [] })
    genres: string[];

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    language?: string;

    @Field(_type => String, { description: 'The language of the book', nullable: true })
    pdfLink?: string;
}

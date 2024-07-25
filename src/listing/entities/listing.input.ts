import { Field, ID, InputType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { Book } from "src/books/entities/book.schema";

@InputType()
export class ListingInput {
    @Field(() => ID)
    _id?: Types.ObjectId;

    @Field(() => String, { description: 'Title of the listing' })
    title: string;

    @Field(() => String, { description: 'description of the listing' })
    description: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => Book, { description: 'The complete information about the book' })
    bookInfo: Book;

    @Field(() => ID)
    listingOwnerId: Types.ObjectId;
}

import { Field, ID, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongodb";
import { Book } from "src/books/entities/book.schema";

@InputType()
export class PostInput {
    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'Title of the post' })
    title: string;

    @Field(() => String, { description: 'description of the post' })
    description: string;

    @Field(() => [String], { description: 'Images of the book' })
    imageUrls: string[];

    @Field(() => Book, { description: 'The complete information about the book' })
    bookInfo: Book;

    @Field(() => ID)
    postOwnerId: ObjectId;
}

import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class Book {

    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'official name of the book' })
    name: string;

    @Field(() => [String], { description: 'description of the book' })
    imageUrls: string[];

    //TODO: Need to create a data type
    @Field({ nullable: true })
    reviews: string;

    @Field(_type => String, { description: 'Category of the book' })
    genre: string;

    @Field(() => String, { nullable: true, description: 'The complete information about the book' })
    bookInfo: any;

}
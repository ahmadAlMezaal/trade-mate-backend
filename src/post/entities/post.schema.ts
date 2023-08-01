import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Book } from 'src/books/entities/book.schema';
import { ProductCondition } from 'src/types/enums';

@ObjectType()
export class Post {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Title of the post', })
  title?: string;

  @Field(() => String, { description: 'description of the post' })
  description: string;

  @Field(() => [String], { description: 'Images of the book' })
  imageUrls: string[];

  @Field(() => Book, { description: 'Contains information about the book that the user is offering.' })
  offeredBookInfo: Book;

  @Field(() => Book, { description: 'Contains information about the requested book.' })
  desiredBookInfo: Book;

  @Field(() => ID)
  postOwnerId: ObjectId;

  @Field(() => Date, { description: 'The date when the post was created' })
  createdAt?: Date;

  @Field(() => Date, { description: 'The last date when the post was updated' })
  updatedAt?: Date;

  @Field(() => String, { description: 'The language of the book' })
  productCondition: ProductCondition;
}

import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Book } from 'src/books/entities/book.schema';

@ObjectType()
export class Post {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Title of the post' })
  title: string;

  @Field(() => String, { description: 'description of the post' })
  description: string;

  // @Field(() => [GraphQLUpload], { description: 'Images of the book' })
  // imageUrls: Array<Express.Multer.File>;
  @Field(() => String, { description: 'Images of the book' })
  imageUrls: string[];


  @Field(() => String, { nullable: true, description: 'The complete information about the book' })
  bookInfo: Book;

  @Field(() => String)
  postOwnerId: ObjectId;
}

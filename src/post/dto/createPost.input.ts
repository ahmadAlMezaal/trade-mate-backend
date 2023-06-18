import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
// import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/types/models';

@InputType()
export class CreatePostInput {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field(() => String, { description: 'Description of the book' })
  @IsString()
  @IsNotEmpty()
  description: string;

  // @Field(() => [GraphQLUpload])
  // imageUrls: Array<Express.Multer.File>;
  // @Field(() => GraphQLUpload, { nullable: true })
  imageUrls?: Promise<FileUpload>;

  // @Field(() => String, { description: 'ID of the book' })
  // @IsString()
  // @IsNotEmpty()
  // bookId: string;
}

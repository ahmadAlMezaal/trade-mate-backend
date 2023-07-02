import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { ObjectId } from 'mongodb';

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

    imageUrls?: string[];

    @Field(() => String, { description: 'ID of the book' })
    @IsString()
    @IsNotEmpty()
    bookId: string;
}

@InputType()
export class FileUploadInput {
    @Field(() => GraphQLUpload)
    file: any;

    @Field()
    title: string;

    @Field()
    description: string;
}
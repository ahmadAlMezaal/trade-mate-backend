import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { ObjectId } from 'mongodb';
import { ProductCondition } from 'src/types/enums';

@InputType()
export class CreatePostInput {

    @Field(() => ID)
    _id?: ObjectId;

    @Field(() => String, { description: 'Title of the post' })
    @IsString()
    @IsOptional()
    title?: string;

    @Field(() => String, { description: 'Description of the book' })
    @IsString()
    @IsNotEmpty()
    description: string;

    imageUrls?: string[];

    @Field(() => String, { description: 'ID of the available book' })
    @IsString()
    @IsNotEmpty()
    availableBookId: string;

    @Field(() => String, { description: 'ID of the desired book' })
    @IsString()
    @IsNotEmpty()
    desiredBookId: string;

    @Field(() => String, { description: 'Condition of the product' })
    @IsEnum(ProductCondition)
    @IsNotEmpty()
    productCondition: ProductCondition;
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
import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';
import { ProductCondition } from 'src/types/enums';

@InputType()
export class CreateListingInput {

    @Field(() => String, { description: 'Title of the listing' })
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
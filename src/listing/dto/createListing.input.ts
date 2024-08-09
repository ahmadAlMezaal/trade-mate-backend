import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
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

    @Field(() => [BookPriorityInput], { description: 'Available book with the list of desired books with priorities' })
    @ValidateNested({ each: true })
    @Type(() => BookPriorityInput)
    @IsArray()
    books: BookPriorityInput[];

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

@InputType()
export class BookPriorityInput {
    @Field(() => String, { description: 'ID of the book' })
    @IsString()
    @IsNotEmpty()
    bookId: string;

    @Field(() => Number, { description: 'Priority of the book' })
    @IsInt()
    @Min(0)
    priority: number;
}
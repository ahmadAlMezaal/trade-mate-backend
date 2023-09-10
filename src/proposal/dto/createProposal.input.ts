import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Book } from 'src/books/entities/book.schema';
import { ProductCondition } from 'src/types/enums';

@InputType()
export class CreateProposalInput {

    @Field(() => String, { description: 'Title of the listing', nullable: true })
    @IsString()
    @IsOptional()
    title?: string;

    @Field(() => String, { description: 'Description of the book' })
    @IsString()
    @IsNotEmpty()
    additionalInfo: string;

    @Field(() => String, { description: 'ID of the available book' })
    @IsString()
    @IsNotEmpty()
    listingId: string;

    @Field(() => String, { description: 'Item submitted by the proposer' })
    @IsNotEmpty()
    offeredItemId: string;

    @Field(() => String, { description: 'Item submitted by the proposer' })
    @IsNotEmpty()
    desiredItemId: string;

    @Field(() => String, { description: 'Condition of the product' })
    @IsEnum(ProductCondition)
    @IsNotEmpty()
    productCondition: ProductCondition;
}

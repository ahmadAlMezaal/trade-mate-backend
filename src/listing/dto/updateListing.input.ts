
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { ListingStatus } from 'src/types/enums';

@InputType()
export class UpdateListingInput {

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    proposalIds?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    status?: ListingStatus;

}

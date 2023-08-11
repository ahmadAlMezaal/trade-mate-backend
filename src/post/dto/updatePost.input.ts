
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { PostStatus } from 'src/types/enums';

@InputType()
export class UpdatePostInput {

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    proposalIds?: string;


    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    status?: PostStatus;

}

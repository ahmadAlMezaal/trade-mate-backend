import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ProposalStatus } from "src/types/enums";

@InputType()
export class UpdateProposalInput {

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    @IsEnum(ProposalStatus)
    status?: ProposalStatus;

}

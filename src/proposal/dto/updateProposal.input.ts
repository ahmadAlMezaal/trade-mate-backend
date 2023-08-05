import { CreateProposalInput } from './createProposal.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProposalInput extends PartialType(CreateProposalInput) {
    @Field(() => Int)
    id: number;
}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProposalService } from './proposal.service';
import { CreateProposalInput } from './dto/createProposal.input';
import { Proposal } from './entities/proposal.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(() => Proposal)
export class ProposalResolver {
    constructor(private readonly proposalService: ProposalService) { }

    @Mutation(() => String, { name: 'sendProposal' })
    @UseGuards(JwtAuthGuard)
    public async createOffer(
        @Args('createProposalInput') createOfferInput: CreateProposalInput,
        @Args('file', { type: () => GraphQLUpload }) fileUpload: FileUpload,
        @CurrentUser() user: User
    ): Promise<string> {
        return await this.proposalService.createOne(createOfferInput, fileUpload, user._id);
    }

    @Query(() => [Proposal], { name: 'offer' })
    public findAll() {
        return this.proposalService.findAll();
    }

    @Query(() => Proposal, { name: 'offer' })
    public findOne(@Args('id', { type: () => Int }) id: number) {
        return this.proposalService.findOne(id);
    }

}

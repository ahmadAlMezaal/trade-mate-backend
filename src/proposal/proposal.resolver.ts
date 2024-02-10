import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProposalService } from './proposal.service';
import { CreateProposalInput } from './dto/createProposal.input';
import { Proposal } from './entities/proposal.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { ProposalStatus } from 'src/types/enums';

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

    @Query(() => [Proposal], { name: 'proposal' })
    public findAll() {
        return this.proposalService.findAll();
    }

    @Query(() => Proposal, { name: 'proposal' })
    public async findOne(@Args('_id', { type: () => String }) _id: string): Promise<Proposal> {
        return await this.proposalService.findOne(_id);
    }

    @Mutation(() => Proposal, { name: 'updateProposalStatus' })
    @UseGuards(JwtAuthGuard)
    public async updateProposal(
        @Args('_id', { type: () => String }) _id: string,
        @Args('status', { type: () => String }) status: ProposalStatus,
        @CurrentUser() user: User
    ): Promise<Proposal> {
        return await this.proposalService.updateProposalStatus(_id, status, user);
    }

}

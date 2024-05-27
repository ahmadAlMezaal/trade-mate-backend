import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proposal, ProposalDocument } from 'src/proposal/entities/proposal.schema';

@Injectable()
export class SharedService {

    constructor(@InjectModel(Proposal.name) private readonly proposalCollection: Model<ProposalDocument>) { }

    findAll() {
        return `This action returns all shared`;
    }

    findOne(id: number) {
        return `This action returns a #${id} shared`;
    }

    remove(id: number) {
        return `This action removes a #${id} shared`;
    }

    public getUserProposals(userId: string): Promise<Proposal[]> {
        return this.proposalCollection.find({ senderId: new Types.ObjectId(userId) });
    }

}

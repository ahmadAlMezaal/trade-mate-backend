import { Inject, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { Proposal } from 'src/proposal/entities/proposal.schema';
import { DBCollectionTokens } from 'src/types/enums';
import { User } from 'src/users/entities/user.schema';

@Injectable()
export class SharedService {

    constructor(
        @Inject(DBCollectionTokens.PROPOSALS_COLLECTION) private readonly proposalCollection: Collection<Proposal>,
        @Inject(DBCollectionTokens.USERS_COLLECTION) private readonly userCollection: Collection<User>,
    ) {
    }

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
        return this.proposalCollection.find({ senderId: new ObjectId(userId) }).toArray();
    }

}

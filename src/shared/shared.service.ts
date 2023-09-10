import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { getCollection } from 'src/helpers/db.helpers';
import { Proposal } from 'src/proposal/entities/proposal.schema';
import { User } from 'src/users/entities/user.schema';

@Injectable()
export class SharedService {

    private readonly proposalCollection: Collection<Proposal>;
    private readonly userCollection: Collection<User>;

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: Db,
    ) {
        this.proposalCollection = getCollection<Proposal>(db, 'proposals');
        this.userCollection = getCollection<User>(db, 'users');
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

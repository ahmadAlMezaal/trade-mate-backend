import { Inject, Injectable } from '@nestjs/common';
import { CreateProposalInput } from './dto/createProposal.input';
import { UpdateProposalInput } from './dto/updateProposal.input';
import { Collection, Db, ObjectId } from 'mongodb';
import { AwsService } from 'src/aws/aws.service';
import { BooksService } from 'src/books/books.service';
import { Proposal } from './entities/proposal.schema';
import { FileUpload } from 'graphql-upload';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProposalService {

    constructor(
        @Inject('PROPOSAL_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService,
        private readonly postService: PostService,
        private readonly awsService: AwsService,
        private readonly userService: UsersService,
    ) { }

    private get collection(): Collection<Proposal> {
        return this.db.collection<Proposal>('proposals');
    }

    public async createOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, userId: ObjectId): Promise<string> {
        const { additionalInfo, listingId, itemId, productCondition } = createOfferInput;

        const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);
        const item = await this.bookService.getBookByProviderId(itemId);

        const proposal = await this.collection.insertOne(
            {
                productCondition,
                additionalInfo,
                item,
                listingId: new ObjectId(listingId),
                imageUrls: [imageUrl],
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        );
        await Promise.all(
            [
                this.postService.pushProposalId(listingId, proposal.insertedId.toString()),
                this.userService.pushProposalId(userId.toString(), proposal.insertedId.toString())
            ]
        )

        return proposal.insertedId.toString();
    }

    public findAll() {
        return `This action returns all offer`;
    }

    public find(params: Partial<Pick<Proposal, 'userId' | 'status'>>) {
        return this.collection.find({ ...params }).toArray();
    }


    public findOne(id: number) {
        return `This action returns a #${id} offer`;
    }
}

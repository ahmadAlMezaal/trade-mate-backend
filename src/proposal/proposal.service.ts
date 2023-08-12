import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProposalInput } from './dto/createProposal.input';
import { UpdateProposalInput } from './dto/updateProposal.input';
import { Collection, Db, ObjectId } from 'mongodb';
import { AwsService } from 'src/aws/aws.service';
import { BooksService } from 'src/books/books.service';
import { Proposal } from './entities/proposal.schema';
import { FileUpload } from 'graphql-upload';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getCollection } from 'src/helpers/db.helpers';
import { Notification, NotificationType } from 'src/notifications/entities/notification.schema';
import { ProposalStatus } from 'src/types/enums';
import { ListingService } from 'src/listing/listing.service';
import { User } from 'src/users/entities/user.schema';

@Injectable()
export class ProposalService {

    private readonly proposalCollection: Collection<Proposal>;

    constructor(
        @Inject('PROPOSAL_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService,
        private readonly listingService: ListingService,
        private readonly awsService: AwsService,
        private readonly userService: UsersService,
        private readonly notificationService: NotificationsService,
    ) {
        this.proposalCollection = getCollection<Proposal>(this.db, 'proposals');
    }

    public async createOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, userId: ObjectId): Promise<string> {

        const { listingId } = createOfferInput;

        const [sender, listing] = await Promise.all(
            [
                this.userService.findOne({ _id: userId }),
                this.listingService.findOne({ _id: new ObjectId(listingId) }),
            ]
        );

        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        const senderFullName = `${sender.firstName} ${sender.lastName}`;
        const proposal = await this.insertOne(createOfferInput, fileUpload, userId)

        await Promise.all(
            [
                this.listingService.pushProposalId(listingId, proposal.insertedId.toString()),
                this.userService.addProposal(userId.toString(), proposal.insertedId.toString())
            ]
        )

        this.notificationService.sendPushNotification(
            {
                listingId,
                title: 'Proposal request',
                message: `${senderFullName} has send you a proposal request`,
                recipientId: listing.listingOwnerId.toString(),
                senderId: userId.toString(),
                type: NotificationType.PROPOSAL_RECEIVED,
                proposalId: proposal.insertedId.toString(),
            }
        );

        return proposal.insertedId.toString();
    }

    public findAll() {
        return `This action returns all offer`;
    }

    public find(params: Partial<Pick<Proposal, 'userId' | 'status'>>) {
        return this.proposalCollection.find({ ...params }).toArray();
    }

    public async findOne(idStr: string): Promise<Proposal> {
        const _id = new ObjectId(idStr);
        const proposal = await this.proposalCollection.findOne({ _id });
        if (!proposal) {
            throw new NotFoundException('Proposal not found!');
        }
        return proposal;
    }

    public async insertOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, userId: ObjectId) {
        const { additionalInfo, listingId, itemId, productCondition } = createOfferInput;
        const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);

        const item = await this.bookService.getBookByProviderId(itemId);

        const proposalDefaults: Partial<Proposal> = {
            status: ProposalStatus.PENDING,
            title: `Trade ${item.title}`,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const proposal = await this.proposalCollection.insertOne(
            {
                productCondition,
                additionalInfo,
                item,
                listingId: new ObjectId(listingId),
                imageUrls: [imageUrl],
                userId,
                ...proposalDefaults,
            }
        );

        return proposal;

    }

    public async updateOne(queryObj: Partial<Proposal>, updateUserInput: UpdateProposalInput) {
        const { value } = await this.proposalCollection.findOneAndUpdate(
            { ...queryObj },
            {
                $set: {
                    ...updateUserInput,
                    updatedAt: new Date()
                }
            },
            {
                upsert: false,
                returnDocument: 'after'
            }
        )
        if (!value) {
            throw new NotFoundException('Account not found');
        }
        return value;
    }

    public async updateProposalStatus(idStr: string, status: ProposalStatus, sender: User): Promise<Proposal> {
        const _id = new ObjectId(idStr);

        const proposal = await this.findOne(idStr);

        let messageDecision = 'accepted';
        let type = NotificationType.PROPOSAL_ACCEPTED;

        if (status === ProposalStatus.REJECTED) {
            messageDecision = 'rejected';
            type = NotificationType.PROPOSAL_REJECTED;
        }
        const updatedProposal = await this.updateOne({ _id }, { status });
        this.notificationService.sendPushNotification(
            {
                title: 'Your proposal status',
                message: `${sender.firstName} ${sender.lastName} has ${messageDecision} your proposal request`,
                recipientId: proposal.userId.toString(),
                senderId: sender._id.toString(),
                proposalId: proposal._id.toString(),
                type,
            }
        );
        return updatedProposal;
    }
}

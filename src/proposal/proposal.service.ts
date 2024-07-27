import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProposalInput } from './dto/createProposal.input';
import { UpdateProposalInput } from './dto/updateProposal.input';
import { AwsService } from 'src/aws/aws.service';
import { BooksService } from 'src/books/books.service';
import { Proposal, ProposalDocument } from './entities/proposal.schema';
import { FileUpload } from 'graphql-upload';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/entities/notification.schema';
import { ProposalStatus } from 'src/types/enums';
import { ListingService } from 'src/listing/listing.service';
import { User } from 'src/users/entities/user.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProposalService {

    constructor(
        @InjectModel(Proposal.name) private readonly proposalCollection: Model<ProposalDocument>,
        private readonly bookService: BooksService,
        private readonly listingService: ListingService,
        private readonly awsService: AwsService,
        private readonly userService: UsersService,
        private readonly notificationService: NotificationsService,
    ) { }

    public async createOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, userId: Types.ObjectId): Promise<string> {

        const { listingId } = createOfferInput;

        const [sender, listing] = await Promise.all(
            [
                this.userService.getUser({ _id: userId }),
                this.listingService.findOne({ _id: new Types.ObjectId(listingId) }),
            ]
        );

        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        if (!listing) {
            throw new NotFoundException('Listing not found');
        }

        const senderFullName = `${sender.firstName} ${sender.lastName}`;
        const proposal = await this.insertOne(createOfferInput, fileUpload, userId, listing.listingOwnerId);

        await Promise.all(
            [
                this.listingService.pushProposalId(listingId, proposal._id.toString()),
                this.userService.addProposal(userId.toString(), proposal._id.toString())
            ]
        );

        this.notificationService.sendPushNotification(
            {
                listingId,
                title: 'Proposal request',
                message: `${senderFullName} has send you a proposal request`,
                recipientId: listing.listingOwnerId.toString(),
                senderId: userId.toString(),
                type: NotificationType.PROPOSAL_RECEIVED,
                proposalId: proposal._id.toString(),
            }
        );

        return proposal._id.toString();
    }

    public findAll() {
        return `This action returns all offer`;
    }

    public find(params: Partial<Pick<Proposal, 'senderId' | 'status'>>) {
        return this.proposalCollection.find({ ...params });
    }

    public async findOne(idStr: string): Promise<Proposal> {
        const _id = new Types.ObjectId(idStr);
        const proposal = await this.proposalCollection.findOne({ _id });
        if (!proposal) {
            throw new NotFoundException('Proposal not found!');
        }
        return proposal;
    }

    public async insertOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, senderId: Types.ObjectId, recipientId: Types.ObjectId): Promise<Proposal> {
        const { additionalInfo, listingId, offeredItemId, desiredItemId, productCondition } = createOfferInput;
        const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);

        const [offeredItem, desiredItem] = await Promise.all(
            [
                this.bookService.getBookByProviderId(offeredItemId),
                this.bookService.getBookByProviderId(desiredItemId),
            ]
        );

        const proposalDefaults: Partial<Proposal> = {
            title: `Trade ${offeredItem.title} for ${desiredItem.title}`,
        };

        const proposal = new this.proposalCollection(
            {
                productCondition,
                additionalInfo,
                offeredItem,
                desiredItem,
                listingId: new Types.ObjectId(listingId),
                imageUrls: [imageUrl],
                senderId,
                recipientId,
                ...proposalDefaults,
            }
        );

        return proposal.save();

    }

    public async updateOne(queryObj: FilterQuery<Proposal>, updateUserInput: UpdateProposalInput): Promise<Proposal> {
        const result = await this.proposalCollection.findOneAndUpdate(
            { ...queryObj },
            {
                $set: {
                    ...updateUserInput,
                }
            },
            {
                new: true,
                rawResult: true,
                includeResultMetadata: true
            }
        );

        if (result && result.lastErrorObject) {
            throw new InternalServerErrorException('Unable to update proposal');
        }

        return result.value;
    }

    public async updateProposalStatus(idStr: string, status: ProposalStatus, sender: User): Promise<Proposal> {
        const _id = new Types.ObjectId(idStr);

        const proposal = await this.updateOne({ _id }, { status });

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
                recipientId: proposal.recipientId.toString(),
                senderId: sender._id.toString(),
                proposalId: proposal._id.toString(),
                type,
            }
        );
        return updatedProposal;
    }

    public async getUserSentProposals(userId: Types.ObjectId): Promise<Proposal[]> {
        return this.proposalCollection.find({ senderId: userId });
    }
}

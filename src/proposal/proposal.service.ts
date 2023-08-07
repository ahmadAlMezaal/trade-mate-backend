import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProposalInput } from './dto/createProposal.input';
import { UpdateProposalInput } from './dto/updateProposal.input';
import { Collection, Db, ObjectId } from 'mongodb';
import { AwsService } from 'src/aws/aws.service';
import { BooksService } from 'src/books/books.service';
import { Proposal } from './entities/proposal.schema';
import { FileUpload } from 'graphql-upload';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getCollection } from 'src/helpers/db.helpers';
import { Notification, NotificationType } from 'src/notifications/entities/notification.schema';

@Injectable()
export class ProposalService {

    private readonly proposalCollection: Collection<Proposal>;

    constructor(
        @Inject('PROPOSAL_COLLECTION') private readonly db: Db,
        private readonly bookService: BooksService,
        private readonly postService: PostService,
        private readonly awsService: AwsService,
        private readonly userService: UsersService,
        private readonly notificationService: NotificationsService,
    ) {
        this.proposalCollection = getCollection<Proposal>(db, 'proposals');
    }

    public async createOne(createOfferInput: CreateProposalInput, fileUpload: FileUpload, userId: ObjectId): Promise<string> {
        const { additionalInfo, listingId, itemId, productCondition } = createOfferInput;

        const imageUrl = await this.awsService.uploadFile(fileUpload.createReadStream, fileUpload.filename);
        const item = await this.bookService.getBookByProviderId(itemId);

        const [sender, post] = await Promise.all(
            [
                this.userService.findOne({ _id: userId }),
                this.postService.findOne({ _id: new ObjectId(listingId) }),
            ]
        );

        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const proposal = await this.proposalCollection.insertOne(
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

        const senderFullName = `${sender.firstName} ${sender.lastName}`;

        await Promise.all(
            [
                this.postService.pushProposalId(listingId, proposal.insertedId.toString()),
                this.userService.addProposal(userId.toString(), proposal.insertedId.toString())
            ]
        )
        this.notificationService.sendPushNotification(
            {
                listingId,
                title: 'Proposal request received',
                message: `${senderFullName} has send you a proposal request`,
                recipientId: post.postOwnerId.toString(),
                senderId: userId.toString(),
                type: NotificationType.PROPOSAL_RECEIVED,
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


    public findOne(id: number) {
        return `This action returns a #${id} offer`;
    }
}

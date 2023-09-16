import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Timestamps } from 'src/common/schemas/timestamps.schema';

export enum NotificationType {
    PROPOSAL_RECEIVED = 'proposal_received',
    ITEM_TRADED = 'item_traded',
    PROPOSAL_ACCEPTED = 'proposal_accepted',
    PROPOSAL_REJECTED = 'proposal_rejected',
    CONNECTION_REQUEST = 'connection_request',
}

export enum NotificationStatus {
    READ = 'read',
    UNREAD = 'unread'
}

@ObjectType()
export class Notification extends Timestamps {

    @Field(() => ID, { description: 'The unique identifier for the notification.' })
    _id?: ObjectId;

    @Field(() => String, { description: 'The title of the message.' })
    title: string;

    @Field(() => String, { description: 'The body of the message.' })
    message: string;

    @Field(() => String, { description: 'The type of notification (e.g., "proposal_received", "item_traded", etc.)' })
    type: NotificationType;

    @Field(() => ID, { description: 'The user who should receive the notification.' })
    recipientId: ObjectId;

    @Field(() => ID, { description: 'The user who initiated the action that triggered the notification (if applicable).', nullable: true })
    senderId?: ObjectId;

    @Field(() => ID, { description: 'The identifier for the listing (if applicable)', nullable: true })
    listingId?: ObjectId;

    @Field(() => ID, { description: 'The identifier for proposal (if applicable)', nullable: true })
    proposalId?: ObjectId;

    @Field(() => String, { description: 'The status of the notification (e.g., "unread", "read").' })
    status?: NotificationStatus;

}

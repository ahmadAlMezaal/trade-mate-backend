import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

export enum NotificationType {
    PROPOSAL_RECEIVED = 'proposal_received',
    ITEM_TRADED = 'item_traded',
    PROPOSAL_ACCEPTED = 'proposal_accepted',
    PROPOSAL_REJECTED = 'proposal_rejected',
    CONNECTION_REQUEST = 'connection_request',
    CONNECTION_REQUEST_ACCEPTED = 'connection_request_accepted',
}

export enum NotificationStatus {
    READ = 'read',
    UNREAD = 'unread'
}

export enum ConnectionStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    PENDING = 'pending',
}

@ObjectType()
export class NotificationMetadata {
    @Field(() => String, { nullable: true })
    status?: ConnectionStatus;

    @Field(() => ID, { nullable: true })
    proposalId?: Types.ObjectId;
}

@ObjectType()
@Schema({ timestamps: true })
export class Notification extends Document {

    @Field(() => ID, { description: 'The unique identifier for the notification.' })
    _id?: Types.ObjectId;

    @Field(() => String, { description: 'The title of the message.' })
    title: string;

    @Field(() => String, { description: 'The body of the message.' })
    message: string;

    @Field(() => String, { description: 'The type of notification (e.g., "proposal_received", "item_traded", etc.)' })
    type: NotificationType;

    @Field(() => ID, { description: 'The user who should receive the notification.' })
    recipientId: Types.ObjectId;

    @Field(() => ID, { description: 'The user who initiated the action that triggered the notification (if applicable).', nullable: true })
    senderId?: Types.ObjectId;

    @Field(() => ID, { description: 'The identifier for the listing (if applicable)', nullable: true })
    listingId?: Types.ObjectId;

    @Field(() => ID, { description: 'The identifier for proposal (if applicable)', nullable: true })
    proposalId?: Types.ObjectId;

    @Field(() => String, { description: 'The status of the notification (e.g., "unread", "read").' })
    status?: NotificationStatus;

    @Field(() => NotificationMetadata, { description: "The metadata of the notification, it's different for each notification type" })
    metadata?: NotificationMetadata;

}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

export type NotificationDocument = HydratedDocument<Notification>;
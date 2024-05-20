import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/createNotification.input';
import { ConnectionStatus, Notification, NotificationDocument, NotificationStatus, NotificationType } from './entities/notification.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectModel(Notification.name) private readonly notificationsCollection: Model<NotificationDocument>,

    ) {
    }

    public async createOne(createNotificationInput: CreateNotificationInput): Promise<Notification> {
        const { senderId, recipientId, message, type, listingId, title, proposalId, metadata } = createNotificationInput;

        const defaults: Partial<Notification> = {
            status: NotificationStatus.UNREAD,
        };

        const notification = new Notification(
            {
                title,
                message,
                recipientId: new Types.ObjectId(recipientId),
                listingId: listingId ? new Types.ObjectId(listingId) : null,
                senderId: senderId ? new Types.ObjectId(senderId) : null,
                proposalId: proposalId ? new Types.ObjectId(proposalId) : null,
                metadata: metadata ?
                    {
                        proposalId: metadata.proposalId || null,
                        status: metadata.status || null,
                    } :
                    null,
                type,
                ...defaults
            }
        );
        const result = await notification.save();
        return result;
    }

    public sendPushNotification(createNotificationInput: CreateNotificationInput) {
        return this.createOne(createNotificationInput);
    }

    public async getUserNotifications(userId: string): Promise<Notification[]> {
        return await this.notificationsCollection
            .find(
                {
                    recipientId: new Types.ObjectId(userId),
                    $or: [
                        { "metadata.status": null },
                        { "metadata.status": ConnectionStatus.PENDING }
                    ]
                }
            );

    }

    public async markAsRead(notificationId: string): Promise<{ success: boolean }> {
        const result = await this.notificationsCollection
            .updateOne(
                { _id: new Types.ObjectId(notificationId) },
                { $set: { status: NotificationStatus.READ } },
            );
        return { success: result.modifiedCount > 0 };

    }

    public async findOne(params: FilterQuery<Notification>) {
        return await this.notificationsCollection.findOne({ ...params });
    }

    public async deleteNotification(params: FilterQuery<Notification>): Promise<DeleteResult> {
        return this.notificationsCollection.deleteOne({ ...params });
    }

    public async respondToConnection(recipientId: string, status: ConnectionStatus) {
        return await this.notificationsCollection.findOneAndUpdate(
            {
                recipientId: new Types.ObjectId(recipientId),
                type: NotificationType.CONNECTION_REQUEST,
                'metadata.status': ConnectionStatus.PENDING
            },
            {
                $set: {
                    'metadata.status': status
                }
            }
        );
    }

}

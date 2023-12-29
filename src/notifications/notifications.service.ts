import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/createNotification.input';
import { Collection, ObjectId } from 'mongodb';
import { ConnectionStatus, Notification, NotificationStatus, NotificationType } from './entities/notification.schema';
import { DBCollectionTokens } from 'src/types/enums';

@Injectable()
export class NotificationsService {

    constructor(
        @Inject(DBCollectionTokens.NOTIFICATIONS_COLLECTION) private readonly notificationsCollection: Collection<Notification>) {
    }

    public async createOne(createNotificationInput: CreateNotificationInput): Promise<Notification> {
        const { senderId, recipientId, message, type, listingId, title, proposalId, metadata } = createNotificationInput;

        const defaults: Partial<Notification> = {
            createdAt: new Date(),
            updatedAt: new Date(),
            status: NotificationStatus.UNREAD,
        }

        const notification: Notification = {
            title,
            message,
            recipientId: new ObjectId(recipientId),
            listingId: listingId ? new ObjectId(listingId) : null,
            senderId: senderId ? new ObjectId(senderId) : null,
            proposalId: proposalId ? new ObjectId(proposalId) : null,
            metadata: metadata ?
                {
                    proposalId: metadata.proposalId || null,
                    status: metadata.status || null,
                } :
                null,
            type,
            ...defaults
        };
        const result = await this.notificationsCollection.insertOne(notification);
        return { _id: result.insertedId, ...notification };
    }

    public sendPushNotification(createNotificationInput: CreateNotificationInput) {
        return this.createOne(createNotificationInput);
    }

    public async getUserNotifications(userId: string): Promise<Notification[]> {
        return await this.notificationsCollection
            .find(
                {
                    recipientId: new ObjectId(userId),
                    $or: [
                        { "metadata.status": null },
                        { "metadata.status": ConnectionStatus.PENDING }
                    ]
                }
            )
            .toArray();

    }

    public async markAsRead(notificationId: string): Promise<{ success: boolean }> {
        const result = await this.notificationsCollection
            .updateOne(
                { _id: new ObjectId(notificationId) },
                { $set: { status: NotificationStatus.READ } },
            );
        return { success: result.modifiedCount > 0 };

    }

    public async findOne(params: Partial<Notification>) {
        return await this.notificationsCollection.findOne({ ...params });
    }

    public async deleteOne(params: Partial<Notification>) {
        return await this.notificationsCollection.deleteOne({ ...params });
    }

    public async respondToConnection(recipientId: string, status: ConnectionStatus) {
        return await this.notificationsCollection.findOneAndUpdate(
            {
                recipientId: new ObjectId(recipientId),
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

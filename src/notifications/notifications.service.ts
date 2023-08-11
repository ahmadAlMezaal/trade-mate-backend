import { Inject, Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/createNotification.input';
import { Collection, Db, ObjectId } from 'mongodb';
import { getCollection } from 'src/helpers/db.helpers';
import { Notification, NotificationStatus } from './entities/notification.schema';

@Injectable()
export class NotificationsService {

    private readonly notificationsCollection: Collection<Notification>;

    constructor(@Inject('NOTIFICATIONS_COLLECTION') private readonly db: Db) {
        this.notificationsCollection = getCollection<Notification>(db, 'notifications');
    }

    public async create(createNotificationInput: CreateNotificationInput): Promise<Notification> {
        const { senderId, recipientId, message, type, listingId, title, proposalId } = createNotificationInput;

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
            type,
            ...defaults
        };
        const result = await this.notificationsCollection.insertOne(notification);
        return { _id: result.insertedId, ...notification };
    }

    public sendPushNotification(createNotificationInput: CreateNotificationInput) {
        return this.create(createNotificationInput);
    }

    findAll() {
        return `This action returns all notifications`;
    }

    public getUserNotifications(userId: string): Promise<Notification[]> {
        return this.notificationsCollection
            .find({ recipientId: new ObjectId(userId) })
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

    public async findOne(idStr: string) {
        const _id = new ObjectId(idStr);
        return await this.notificationsCollection.findOne({ _id });
    }

}

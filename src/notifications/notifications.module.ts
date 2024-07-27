import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './entities/notification.schema';

@Module(
    {
        imports: [
            MongooseModule.forFeature(
                [
                    {
                        name: Notification.name,
                        schema: NotificationSchema
                    }
                ]
            )
        ],
        providers: [
            NotificationsResolver,
            NotificationsService,
        ],
        exports: [NotificationsService]
    }
)

export class NotificationsModule { }

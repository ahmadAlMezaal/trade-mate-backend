import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { notificationsProviders } from './providers/notifications.provider';

@Module(
    {
        providers: [...notificationsProviders, NotificationsResolver, NotificationsService],
        exports: [NotificationsService]
    }
)

export class NotificationsModule { }

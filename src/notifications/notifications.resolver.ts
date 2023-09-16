import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.schema';

@Resolver(() => Notification)
export class NotificationsResolver {

    constructor(private readonly notificationsService: NotificationsService) { }

    @Query(() => [Notification], { name: 'notifications' })
    findAll() {
        return this.notificationsService.findAll();
    }

    @Query(() => [Notification], { name: 'notifications' })
    @UseGuards(JwtAuthGuard)
    public async find(@CurrentUser() user: User) {
        return await this.notificationsService.getUserNotifications(user._id.toString());
    }

}

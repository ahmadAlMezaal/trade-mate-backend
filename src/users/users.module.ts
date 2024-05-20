import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { ConfigModule } from '@nestjs/config';
import { ListingModule } from 'src/listing/listing.module';
import { SharedModule } from 'src/shared/shared.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';

@Module(
    {
        //TODO: Try to make the ConfigModule in CommonModule
        imports: [
            ConfigModule,
            CommonModule,
            ListingModule,
            SharedModule,
            NotificationsModule,
            MongooseModule.forFeature(
                [
                    {
                        name: User.name,
                        schema: UserSchema
                    }
                ]
            )
        ],
        providers: [
            UsersResolver,
            UsersService,
        ],
        exports: [UsersService]
    }
)

export class UsersModule { }

import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { userProviders } from './providers/user.providers';
import { ConfigModule } from '@nestjs/config';
import { ListingModule } from 'src/listing/listing.module';
import { SharedModule } from 'src/shared/shared.module';

@Module(
    {
        //TODO: Try to make the ConfigModule in CommonModule
        imports: [
            ConfigModule,
            CommonModule,
            ListingModule,
            SharedModule
        ],
        providers: [
            UsersResolver,
            UsersService,
            ...userProviders,
        ],
        exports: [UsersService, ...userProviders]
    }
)

export class UsersModule { }

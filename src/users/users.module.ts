import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { userProviders } from './providers/user.providers';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from 'src/post/post.module';

@Module(
    {
        //TODO: Try to make the ConfigModule in CommonModule
        imports: [ConfigModule, CommonModule, PostModule],
        providers: [
            UsersResolver,
            UsersService,
            ...userProviders,
        ],
        exports: [UsersService, ...userProviders]
    }
)

export class UsersModule { }

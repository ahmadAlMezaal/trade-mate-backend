import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { userProviders } from './providers/user.providers';

@Module(
    {
        providers: [
            UsersResolver,
            UsersService,
            ...userProviders,
        ],
        exports: [UsersService, ...userProviders]
    }
)

export class UsersModule { }

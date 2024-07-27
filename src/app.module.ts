import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ListingModule } from './listing/listing.module';
import { SharedModule } from './shared/shared.module';
import { ProposalModule } from './proposal/Proposal.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { DatabaseModule } from './common/modules/database.module';

@Module(
    {
        imports: [
            ConfigModule.forRoot(
                {
                    isGlobal: true,
                    load: [configuration]
                }
            ),
            DatabaseModule,
            CommonModule,
            UsersModule,
            AuthModule,
            BooksModule,
            ListingModule,
            ProposalModule,
            SharedModule,
            NotificationsModule,
            OauthModule,
        ],

        providers: [AppService],
        controllers: [AppController],
    }
)

export class AppModule { }

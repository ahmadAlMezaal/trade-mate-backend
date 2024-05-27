import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ListingModule } from './listing/listing.module';
import { SharedModule } from './shared/shared.module';
import { ProposalModule } from './proposal/Proposal.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { ConfigVariables } from './types/enums';

@Module(
    {
        imports: [
            ConfigModule.forRoot(
                {
                    isGlobal: true,
                    load: [configuration]
                }
            ),
            // DatabaseModule,
            MongooseModule.forRootAsync(
                {
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({ uri: configService.get<string>(ConfigVariables.MONGODB_URI) }),
                }
            ),
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

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppIdentifierMiddleware } from './common/middlewares/appIdentifier.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BooksModule } from './books/books.module';
import { ListingModule } from './listing/listing.module';
import { SharedModule } from './shared/shared.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OauthModule } from './oauth/oauth.module';
import { ProposalModule } from './proposal/Proposal.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
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
                    useFactory: (configService: ConfigService) => {
                        const uri = configService.get<string>(ConfigVariables.MONGODB_URI);
                        const mongoose = new Mongoose();

                        mongoose.connection.on('connected', () => {
                            console.log('Connected to MongoDB!'.toUpperCase());
                        });

                        mongoose.connection.on('error', (err) => {
                            console.error('Error connecting to MongoDB:', err.message);
                        });

                        mongoose.connection.on('disconnected', () => {
                            console.log('Disconnected from MongoDB'.toLowerCase());
                        });

                        return { uri };
                    },
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

        providers: [
            AppService,
            // {
            //     provide: APP_INTERCEPTOR,
            //     useClass: AppIdentifierMiddleware,
            // },
        ],
        controllers: [AppController],
    }
)

// export class AppModule implements NestModule {
//     configure(consumer: MiddlewareConsumer) {
//         consumer
//             .apply(AppIdentifierMiddleware)
//             .forRoutes({ path: '*', method: RequestMethod.ALL });
//     }
// }

export class AppModule { }

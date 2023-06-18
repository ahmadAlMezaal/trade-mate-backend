import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppIdentifierMiddleware } from './common/middlewares/appIdentifier.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BooksModule } from './books/books.module';
import { PostModule } from './post/post.module';
// @ts-ignore
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload"
import { GraphQLModule } from '@nestjs/graphql';


@Module(
    {
        imports: [
            CommonModule,
            UsersModule,
            AuthModule,
            BooksModule,
            PostModule
        ],
        providers: [
            AppService,
            {
                provide: APP_INTERCEPTOR,
                useClass: AppIdentifierMiddleware,
            }

        ],
        controllers: [AppController],
    }
)

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // consumer.apply(graphqlUploadExpress()).forRoutes("graphql")

        // consumer
        //     .apply(AppIdentifierMiddleware)
        //     .forRoutes({ path: '*', method: RequestMethod.ALL });
        // consumer.apply(graphqlUploadExpress()).forRoutes("graphql")
    }
}

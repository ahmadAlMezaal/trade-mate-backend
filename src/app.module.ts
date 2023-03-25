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

@Module(
    {
        providers: [
            AppService,
            {
                provide: APP_INTERCEPTOR,
                useClass: AppIdentifierMiddleware,
            }
        ],
        imports: [
            CommonModule,
            UsersModule,
            AuthModule,
            BooksModule,
            PostModule
        ],
        controllers: [AppController],
    }
)

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AppIdentifierMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }

}

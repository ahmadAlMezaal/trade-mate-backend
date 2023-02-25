import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppIdentifierMiddleware } from './common/middlewares/appIdentifier.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module(
    {
        providers: [
            AppService,
            {
                provide: APP_INTERCEPTOR,
                useClass: AppIdentifierMiddleware,
            }
        ],
        imports: [CommonModule, UsersModule, AuthModule],
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

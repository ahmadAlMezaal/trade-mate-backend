import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/modules/common.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module(
    {
        imports: [CommonModule, UsersModule, AuthModule],
        controllers: [AppController],
        providers: [AppService],
    }
)
export class AppModule { }

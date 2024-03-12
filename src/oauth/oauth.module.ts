import { Module } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { OauthResolver } from './oauth.resolver';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module(
    {
        imports: [UsersModule, AuthModule],
        providers: [OauthResolver, OauthService]
    }
)
export class OauthModule { }

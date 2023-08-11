import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module(
    {
        imports: [
            PassportModule,
            JwtModule.registerAsync(
                {
                    useFactory: async (configService: ConfigService) => {
                        return {
                            secret: configService.get<string>('jwt.secret'),
                            signOptions: { expiresIn: configService.get<string>('jwt.expiration') },
                        }
                    },
                    inject: [ConfigService],
                }
            ),
            UsersModule,
        ],
        providers: [
            AuthResolver,
            AuthService,
            LocalStrategy,
            JwtStrategy,
        ],
        exports: [AuthService],
    }
)

export class AuthModule { }

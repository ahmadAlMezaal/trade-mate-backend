import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';

import { UsersService } from 'src/users/users.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module(
    {
        imports: [
            JwtModule.registerAsync(
                {
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => (
                        {
                            secret: configService.get<string>('jwt.secret'),
                            signOptions: { expiresIn: configService.get<string>('jwt.expiration') },
                        }
                    ),
                }
            ),
            UsersModule,
            PassportModule,
        ],
        providers: [
            AuthResolver,
            JwtService,
            UsersService,
            AuthService,
            LocalStrategy,
            JwtStrategy,
        ],
        exports: [AuthService],
    }
)

export class AuthModule { }

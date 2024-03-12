
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: process.env.JWT_SECRET,
            }
        );
    }

    async validate(payload: any) {
        const { email }: { email: string } = payload;
        const user = await this.userService.getUser({ email });
        if (!user) {
            throw new UnauthorizedException('You are not authorized');
        }
        return user;
    }
}
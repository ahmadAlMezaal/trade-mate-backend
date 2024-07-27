
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.schema';
import { ResetPasswordInput } from './dto/resetPassword.input';
import { LoginInput } from 'src/users/dto/login.input';
import { IUserLocation } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    public async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.getUser({ email });
        const doesPasswordMatch = await bcrypt.compare(pass, user.password);
        if (doesPasswordMatch) {
            delete user.password;
            return user;
        }
        return null;
    }

    public generateToken(email: string, sub: Types.ObjectId) {
        const payload = { email, sub };
        return this.jwtService.signAsync(payload);
    }

    public async login(user: User, input?: LoginInput): Promise<{ user: User, accessToken: string }> {
        try {
            const updatedAttributes: IUserLocation = { ...user.location };

            if (input.city) {
                updatedAttributes['city'] = input.city;
            }

            if (input.country) {
                updatedAttributes['country'] = input.country;
            }

            if (input.isoCountryCode) {
                updatedAttributes['isoCode'] = input.isoCountryCode;
            }

            const updatedUser = await this.usersService.updateOne(
                {
                    email: user.email
                },
                {
                    location: { ...updatedAttributes }
                }
            );

            return {
                accessToken: await this.generateToken(user.email, user._id),
                user: updatedUser,
            };
        } catch {
            throw new Error('An error occurred during the login process.');
        }
    }

    public async requestForgotPassword(email: string) {
        const user = await this.usersService.getUser({ email: email.toLowerCase() });
        const code = Math.floor(Math.random() * 90000) + 100000;
        await this.usersService.updateOne({ _id: user._id }, { forgotPasswordCode: code });
        return {
            code,
            message: 'Password reset request has been sent to your email address.',
        };
    }

    public async resetPassword(input: ResetPasswordInput) {
        const user = await this.usersService.getUser({ email: input.email.toLowerCase() });
        const saltOrRounds = 10;
        const newPassword = await bcrypt.hash(input.password, saltOrRounds);

        await this.usersService.updateOne({ _id: user._id }, { forgotPasswordCode: null, password: newPassword });

        return { message: 'Password changed successfully!' };
    }
}


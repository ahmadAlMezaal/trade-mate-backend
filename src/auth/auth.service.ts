
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.schema';
import { ObjectId } from 'mongodb';
import { ResetPasswordInput } from './dto/resetPassword.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    public async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({ email });
        if (!user) {
            throw new NotFoundException('Account not found!');
        }
        const doesPasswordMatch = await bcrypt.compare(pass, user.password);
        if (doesPasswordMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    public async generateToken(email: string, sub: ObjectId) {
        const payload = { email, sub };
        return await this.jwtService.signAsync(payload)
    }

    public async login(user: User): Promise<{ user: User, accessToken: string }> {
        return {
            accessToken: await this.generateToken(user.email, user._id),
            user,
        };
    }

    public async requestforgotPassword(email: string) {
        const user = await this.usersService.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new NotFoundException('Email does not exist');
        }
        const code = Math.floor(Math.random() * 90000) + 100000;
        await this.usersService.update({ _id: user._id }, { forgotPasswordCode: code })
        return {
            code,
            message: 'Password reset request has been sent to your email address.',
        };
    }

    public async resetPassword(input: ResetPasswordInput) {
        const user = await this.usersService.findOne({ email: input.email.toLowerCase() });
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
        }
        const saltOrRounds = 10;
        const newPassword = await bcrypt.hash(input.password, saltOrRounds);

        const tst = await this.usersService.update({ _id: user._id }, { forgotPasswordCode: null, password: newPassword });

        return { message: 'Password changed successfully!' }
    }
}


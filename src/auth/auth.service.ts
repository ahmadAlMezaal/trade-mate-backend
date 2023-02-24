
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    public async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne({ email });
        if (!user) {
            throw new NotFoundException('User not found!');
        }
        const doesPasswordMatch = await bcrypt.compare(pass, user.password);
        if (doesPasswordMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    public generateToken(email: string, sub: ObjectId) {
        const payload = { email, sub };
        return this.jwtService.signAsync(payload)
    }

    public async login(user: User): Promise<{ user: User, accessToken: string }> {
        return {
            accessToken: await this.generateToken(user.email, user._id),
            user,
        };
    }
}


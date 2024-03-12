import { Injectable } from '@nestjs/common';
import { OauthInput } from './dto/createOauth.input';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInput } from 'src/users/dto/createUser.input';
import * as bcrypt from 'bcrypt';
import { UpdateUserProfileInput } from 'src/users/dto/updateUser.input';

@Injectable()
export class OauthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    public async authenticateWithGoogle(input: OauthInput): Promise<{ user: User, accessToken: string }> {
        try {

            console.log('input: ', input);

            const existingUser = await this.usersService.findOne({ email: input.email.toLowerCase() });
            console.log('existingUser: ', existingUser);

            let accessToken = '';
            const { email, firstName, lastName, city, country, isoCountryCode } = input;

            if (existingUser) {
                accessToken = await this.authService.generateToken(existingUser.email, existingUser._id);
                const updateParams: UpdateUserProfileInput = {
                    city,
                    country,
                    isoCountryCode,
                };
                this.usersService.updateUserProfile(updateParams);

                return {
                    user:
                    {
                        ...existingUser,
                        location: {
                            city,
                            country,
                            isoCode: isoCountryCode
                        }
                    },
                    accessToken
                };
            }
            const randomPassword = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const newUser: CreateUserInput = {
                email,
                city,
                country,
                firstName,
                isoCountryCode,
                lastName,
                password: hashedPassword
            };
            const user = await this.usersService.create(newUser);
            accessToken = await this.authService.generateToken(user.email, user._id);

            console.log('user: ', user);

            return { user, accessToken };
        } catch (error) {
            console.log('error: ', error);
            throw new Error('An error occurred while authenticating with Google.');
        }
    }

}

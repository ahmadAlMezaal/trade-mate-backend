import { Injectable } from '@nestjs/common';
import { FacebookAuthDto, OauthInput } from './dto/createOauth.input';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInput } from 'src/users/dto/createUser.input';
import * as bcrypt from 'bcrypt';
import { UpdateUserProfileInput } from 'src/users/dto/updateUser.input';
import axios from 'axios';
import { FacebookUserDataResponse } from './entities/oauth.entity';
import { LoginResponse } from 'src/auth/schemas/auth.schema';
import { User } from 'src/users/entities/user.schema';

@Injectable()
export class OauthService {

    private bcryptSalt = bcrypt.genSaltSync(10);

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) { }

    public async authenticateWithGoogle(input: OauthInput): Promise<{ user: User, accessToken: string }> {
        try {

            const existingUser = await this.usersService.findOne({ email: input.email.toLowerCase() });
            const { email, firstName, lastName, city, country, isoCountryCode } = input;
            let accessToken = '';

            if (existingUser) {
                accessToken = await this.authService.generateToken(existingUser.email, existingUser._id);
                const updateParams: UpdateUserProfileInput = {
                    city,
                    country,
                    isoCountryCode,
                };
                this.usersService.updateUserProfile(email, updateParams);

                return {
                    user:
                    {
                        ...existingUser as any,
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

            return { user, accessToken };
        } catch (error) {
            throw new Error('An error occurred while authenticating with Google.');
        }
    }

    private async getFacebookUserData(access_token: string): Promise<FacebookUserDataResponse> {
        return axios(
            {
                url: 'https://graph.facebook.com/me',
                method: 'get',
                params: {
                    fields: ['email', 'first_name', 'last_name', 'picture.height(961)',].join(','),
                    access_token,
                },
            }
        );
    }

    async facebookAuthentication(dto: FacebookAuthDto): Promise<LoginResponse> {
        const response = await this.getFacebookUserData(dto.identityToken);
        const { email, first_name, last_name, picture, id: facebookId } = response.data;
        let existingUser = await this.usersService.findOne({ facebookId });
        let accessToken = '';

        if (existingUser) {
            accessToken = await this.authService.generateToken(existingUser.email, existingUser._id);
            if (picture.data.url && (!existingUser.profilePhoto || existingUser.profilePhoto !== picture.data.url)) {
                existingUser = await this.usersService.updateOne({ _id: existingUser._id }, { profilePhoto: picture.data.url });
            }
            return { user: existingUser, accessToken };
        }
        const hashText = (Math.random() + 1).toString(36).substring(2);
        const hash = await bcrypt.hash(hashText, this.bcryptSalt);
        const newUser = await this.usersService.create(
            {
                email,
                city: dto.city,
                country: dto.country,
                isoCountryCode: dto.isoCountryCode,
                firstName: first_name,
                lastName: last_name,
                password: hash,
                profilePhoto: picture.data.url,
                facebookId
            }
        );
        accessToken = await this.authService.generateToken(newUser.email, newUser._id);
        return { user: newUser, accessToken };
    }

}

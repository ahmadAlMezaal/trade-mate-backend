import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OauthService } from './oauth.service';
import { LoginResponse } from 'src/auth/schemas/auth.schema';
import { OauthInput } from './dto/createOauth.input';

@Resolver('Oauth')
export class OauthResolver {

    constructor(
        private readonly oauthService: OauthService,
    ) { }

    @Mutation(() => LoginResponse, { name: 'authenticateWithGoogle' })
    public async googleAuth(@Args('input') input: OauthInput): Promise<LoginResponse> {
        return await this.oauthService.authenticateWithGoogle(input);
    }

}

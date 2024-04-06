import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OauthService } from './oauth.service';
import { LoginResponse } from 'src/auth/schemas/auth.schema';
import { FacebookAuthDto, OauthInput } from './dto/createOauth.input';

@Resolver('oauth')
export class OauthResolver {

    constructor(
        private readonly oauthService: OauthService,
    ) { }

    @Mutation(() => LoginResponse, { name: 'authenticateWithGoogle' })
    public googleOAuth(@Args('input') input: OauthInput): Promise<LoginResponse> {
        return this.oauthService.authenticateWithGoogle(input);
    }

    @Mutation(() => LoginResponse, { name: 'authenticateWithFacebook' })
    public facebookOAuth(@Args('input') input: FacebookAuthDto) {
        return this.oauthService.facebookAuthentication(input);
    }

}

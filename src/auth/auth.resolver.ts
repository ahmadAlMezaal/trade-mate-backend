import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { LoginInput } from 'src/users/dto/login.input';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { CreateUserInput } from 'src/users/dto/createUser.input';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Mutation(() => User, { name: 'login' })
    async login(@Args('input') loginInput: LoginInput): Promise<any> {
        console.log('loginInput: ', loginInput);
        return await this.authService.login(loginInput);
    }

    // @Mutation(() => Boolean)
    // async logout(@Context() context, @CurrentUser() user: User): Promise<boolean> {
    //     await this.authService.logout(context.req.user);
    //     context.req.logout();
    //     return true;
    // }
}

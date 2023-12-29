import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { LoginInput } from 'src/users/dto/login.input';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql.guard';
import { LoginResponse } from './schemas/auth.schema';
import { User } from 'src/users/entities/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from 'src/users/dto/createUser.input';
import { ForgotPasswordInput } from './dto/forgotPassword.input';
import { ForgotPasswordResponse } from './schemas/forgotPassword.schema';
import { ResetPasswordResponse } from './schemas/resetPassword.schema';
import { ResetPasswordInput } from './dto/resetPassword.input';

@Resolver('Auth')
export class AuthResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) { }

    @Mutation(() => LoginResponse, { name: 'signup', })
    public async signup(@Args('input') createUserInput: CreateUserInput): Promise<LoginResponse> {
        const user = await this.userService.create(createUserInput);
        const accessToken = await this.authService.generateToken(user.email, user._id);
        return { user, accessToken };
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => LoginResponse, { name: 'login' })
    public async login(@Args('input') _input: LoginInput, @Context() context: any): Promise<LoginResponse> {
        return await this.authService.login(context.req.user);
    }

    @Mutation(() => ForgotPasswordResponse, { name: 'forgotPassword' })
    public forgotPassword(@Args('input') input: ForgotPasswordInput) {
        return this.authService.requestforgotPassword(input.email);
    }

    @Mutation(() => ResetPasswordResponse, { name: 'resetPassword' })
    public resetPassword(@Args('input') input: ResetPasswordInput) {
        return this.authService.resetPassword(input);
    }

    @Query(() => User, { name: 'me' })
    @UseGuards(GqlAuthGuard)
    public async me(@Context() ctx: any) {
        const user = ctx.req.user;
        return await this.userService.findOne({ _id: user._id });
    }

    // @Mutation(() => Boolean)
    // async logout(@Context() context, @CurrentUser() user: User): Promise<boolean> {
    //     await this.authService.logout(context.req.user);
    //     context.req.logout();
    //     return true;
    // }
}

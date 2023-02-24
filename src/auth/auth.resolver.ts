import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { LoginInput } from 'src/users/dto/login.input';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql.guard';
import { LoginResponse } from './entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UsersService } from 'src/users/users.service';
import { CreateUserInput } from 'src/users/dto/createUser.input';

@Resolver('Auth')
export class AuthResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) { }

    @Mutation(() => LoginResponse, { name: 'signup', nullable: true })
    async signup(@Args('input') createUserInput: CreateUserInput): Promise<LoginResponse> {
        const user = await this.userService.create(createUserInput);
        const accessToken = await this.authService.generateToken(user.email, user._id);
        return { user, accessToken };
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => LoginResponse, { name: 'login', nullable: true })
    login(@Args('input') _input: LoginInput, @Context() context: any): Promise<LoginResponse> {
        return this.authService.login(context.req.user);
    }

    @Query(() => User, { name: 'me' })
    @UseGuards(GqlAuthGuard)
    async me(@Context() ctx: any) {
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

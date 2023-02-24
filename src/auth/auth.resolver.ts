import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { LoginInput } from 'src/users/dto/login.input';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql.guard';
import { LoginResponse } from './entities/auth.entity';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UsersService } from 'src/users/users.service';

@Resolver('Auth')
export class AuthResolver {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => LoginResponse, { name: 'login', nullable: true })
    login(@Args('input') _input: LoginInput, @Context() context: any): Promise<LoginResponse> {
        return this.authService.login(context.req.user);
    }

    // @Mutation(() => Boolean)
    // async logout(@Context() context, @CurrentUser() user: User): Promise<boolean> {
    //     await this.authService.logout(context.req.user);
    //     context.req.logout();
    //     return true;
    // }

    @Query(() => User, { name: 'me' })
    @UseGuards(GqlAuthGuard)
    async me(@Context() ctx: any) {
        const user = ctx.req.user;
        return await this.userService.findOne({ _id: user._id });
    }

    // @Query(() => User)
    // @UseGuards(GqlAuthGuard)
    // me(@CurrentUser() user: User): any {
    //     return user;
    // }
}

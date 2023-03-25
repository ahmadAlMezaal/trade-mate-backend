import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {

    // protected readonly logger = new Logger(LocalAuthGuard.name);

    getRequest(context: ExecutionContext) {
        try {
            const ctx = GqlExecutionContext.create(context);
            const gqlReq = ctx.getContext().req;
            if (gqlReq) {
                const { input } = ctx.getArgs();
                gqlReq.body = input;
                return gqlReq;
            }
            return context.switchToHttp().getRequest();
        } catch (error) {
            console.log('getRequest error: ', error);
        }
    }

    // handleRequest(err, user, info) {

    //     if (err || !user) {
    //         throw err || new UnauthorizedException();
    //     }
    //     return user; // return the authenticated user object
    // }

    // async canActivate(context: ExecutionContext): Promise<boolean> {
    //     try {
    //         const ctx = GqlExecutionContext.create(context);
    //         const { req } = ctx.getContext();
    //         const superCanActivate = await super.canActivate(new ExecutionContextHost([req]));

    //         if (superCanActivate) {
    //             return true;
    //         }
    //     } catch (error) {
    //         console.log('eerrrrrr: ', error);

    //     }

    //     throw new AuthenticationError('Unauthorized');
    // }

}

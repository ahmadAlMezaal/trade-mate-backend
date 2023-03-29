
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.JWT) {

    //!Commenting this out would cause this error: Cannot read properties of undefined (reading 'logIn')
    getRequest(context: ExecutionContext) {
        try {
            const ctx = GqlExecutionContext.create(context);
            const { req } = ctx.getContext();
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                req.headers.authorization = `Bearer ${token}`;
            }

            return req;
        } catch (error) {
            console.log('getRequest error: ', error);
        }
    }

    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        const authorization = req.headers.authorization;

        if (authorization) {
            const token = authorization.split(' ')[1];
            req.headers.authorization = `Bearer ${token}`;
            return super.canActivate(context);
        }
        return false;
    }

    handleRequest(err: any, user: any) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
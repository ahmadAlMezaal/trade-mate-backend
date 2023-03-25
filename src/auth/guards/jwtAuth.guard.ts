
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
const jwt = require('jsonwebtoken');

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.JWT) {

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

    handleRequest(err: any, user: any,) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
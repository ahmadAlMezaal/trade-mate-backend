
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyType.JWT) {

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

}
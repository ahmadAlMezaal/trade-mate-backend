import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../strategies/strategyTypes.enum';

@Injectable()
export class GqlAuthGuard extends AuthGuard(StrategyType.LOCAL) {

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

}

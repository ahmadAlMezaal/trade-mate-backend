import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class OwnsProfileGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        const user = ctx.req.user;
        const { userId } = ctx.args;

        if (user && user._id === userId) {
            return true;
        }

        throw new ForbiddenException('You are not authorized to perform this action.');
    }
}

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppIdentifierMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: () => void) {
        const appIdentifier = req.headers['x-app-identifier'];
        if (appIdentifier !== process.env.BOOK_TRADER_IDENTIFIER) {
            throw new UnauthorizedException('You are not authorized')
        }
        next();
    }
}

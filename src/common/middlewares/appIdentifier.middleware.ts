import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppIdentifierMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: () => void) {
        const appIdentifier = req.headers['x-app-identifier'];
        if (appIdentifier !== process.env.BOOK_TRADER_IDENTIFIER && !req.url.includes('/health')) {
            throw new UnauthorizedException('Invalid app identifier')
        }
        next();
    }
}

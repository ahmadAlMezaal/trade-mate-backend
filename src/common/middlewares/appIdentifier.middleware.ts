import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppIdentifierMiddleware implements NestMiddleware {
    async use(req: Request, _res: Response, next: () => void) {
        const appIdentifier = req.headers['x-app-identifier'];
        if (appIdentifier !== 'c2d9eae0-187f-4d94-8d65-45ee36adceca' && !req.url.includes('/health')) {
            throw new UnauthorizedException('Invalid app identifier')
        }
        next();
    }
}

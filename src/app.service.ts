import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    checkAppHealth(): string {
        return 'Book-trader is up and running!';
    }
}

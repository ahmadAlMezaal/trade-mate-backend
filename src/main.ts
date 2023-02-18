import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000).then(
        () => console.log('Backend up and running on port 3000'.toUpperCase())
    );
}
bootstrap();

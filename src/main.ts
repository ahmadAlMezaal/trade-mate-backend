import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadSecrets } from './config/configuration';
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';


async function bootstrap() {
    await loadSecrets();
    const app = await NestFactory.create(AppModule);
    app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
    await app.listen(3000).then(
        () => console.log('Backend up and running on port 3000'.toUpperCase())
    );
}
bootstrap();

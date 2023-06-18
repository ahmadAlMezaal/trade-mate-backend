import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// @ts-ignore
import { graphqlUploadExpress } from 'graphql-upload';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        GraphQLModule.forRoot({
            path: '/graphql',
            uploads: false,
        }),
    ],
})
export class BaseModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
    }
}
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from 'src/users/users.module';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module(
    {
        imports: [
            GraphQLModule.forRoot<ApolloDriverConfig>(
                {
                    // include: [UsersModule],
                    driver: ApolloDriver,
                    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
                    debug: true,
                    sortSchema: true,
                    playground: true,
                }
            ),
        ],
    }
)
export class GraphqlModule { }
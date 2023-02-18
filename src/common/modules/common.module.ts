import { Module } from '@nestjs/common';
import { CustomConfigModule } from './config.module';
import { DatabaseModule } from './database.module';
import { GraphqlModule } from './graphql.module';

@Module(
    {
        imports: [CustomConfigModule, GraphqlModule, DatabaseModule],
        exports: [CustomConfigModule, GraphqlModule, DatabaseModule],

    }
)

export class CommonModule { }
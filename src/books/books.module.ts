import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/modules/common.module';

import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './entities/book.schema';

@Module(
    {
        imports: [
            ConfigModule,
            CommonModule,
            MongooseModule.forFeature(
                [
                    {
                        name: Book.name,
                        schema: BookSchema
                    }
                ]
            )
        ],
        providers: [BooksResolver, BooksService],
        exports: [BooksService]
    }
)

export class BooksModule { }


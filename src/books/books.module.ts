import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from 'src/common/modules/common.module';

import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { booksProviders } from './providers/books.provider';

@Module(
    {
        imports: [ConfigModule, CommonModule],
        providers: [BooksResolver, BooksService, ...booksProviders],
        exports: [BooksService, ...booksProviders]
    }
)

export class BooksModule { }


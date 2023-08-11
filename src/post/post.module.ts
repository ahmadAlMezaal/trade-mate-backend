import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { postsProviders } from './providers/post.provider';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';

@Module(
    {
        imports: [CommonModule, BooksModule, AwsModule],
        providers: [PostResolver, PostService, ...postsProviders],
        exports: [...postsProviders, PostService],
    }
)

export class PostModule { }

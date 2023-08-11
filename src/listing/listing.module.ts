import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { ListingService } from './listing.service';
import { ListingResolver } from './listing.resolver';
import { listingProviders } from './providers/listing.provider';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';

@Module(
    {
        imports: [CommonModule, BooksModule, AwsModule],
        providers: [ListingResolver, ListingService, ...listingProviders],
        exports: [...listingProviders, ListingService],
    }
)

export class ListingModule { }

import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/modules/common.module';

import { ListingService } from './listing.service';
import { ListingResolver } from './listing.resolver';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Listing, ListingSchema } from './entities/listing.schema';

@Module(
    {
        imports: [
            CommonModule,
            BooksModule,
            AwsModule,
            MongooseModule.forFeature(
                [
                    {
                        name: Listing.name,
                        schema: ListingSchema
                    }
                ]
            )
        ],
        providers: [ListingResolver, ListingService],
        exports: [ListingService],
    }
)

export class ListingModule { }

import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalResolver } from './proposal.resolver';
import { CommonModule } from 'src/common/modules/common.module';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';
import { ListingModule } from 'src/listing/listing.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from './entities/proposal.schema';

@Module(
    {
        imports: [
            CommonModule,
            BooksModule,
            AwsModule,
            ListingModule,
            UsersModule,
            NotificationsModule,
            MongooseModule.forFeature(
                [
                    {
                        name: Proposal.name,
                        schema: ProposalSchema
                    }
                ]
            )
        ],
        providers: [ProposalResolver, ProposalService],
        exports: [ProposalService],
    }
)

export class ProposalModule { }

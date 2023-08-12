import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalResolver } from './proposal.resolver';
import { proposalProviders } from './providers/proposal.provider';
import { CommonModule } from 'src/common/modules/common.module';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';
import { ListingModule } from 'src/listing/listing.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module(
    {
        imports: [
            CommonModule,
            BooksModule,
            AwsModule,
            ListingModule,
            UsersModule,
            NotificationsModule,
        ],
        providers: [...proposalProviders, ProposalResolver, ProposalService],
        exports: [...proposalProviders, ProposalService],
    }
)

export class ProposalModule { }

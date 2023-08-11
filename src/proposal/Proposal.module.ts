import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalResolver } from './proposal.resolver';
import { proposalProviders } from './providers/proposal.provider';
import { CommonModule } from 'src/common/modules/common.module';
import { BooksModule } from 'src/books/books.module';
import { AwsModule } from 'src/aws/aws.module';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module(
    {
        imports: [
            CommonModule,
            BooksModule,
            AwsModule,
            PostModule,
            UsersModule,
            NotificationsModule,
        ],
        providers: [...proposalProviders, ProposalResolver, ProposalService],
        exports: [...proposalProviders, ProposalService],
    }
)

export class ProposalModule { }

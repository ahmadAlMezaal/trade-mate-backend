import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Proposal, ProposalSchema } from 'src/proposal/entities/proposal.schema';

@Module(
    {
        imports: [
            MongooseModule.forFeature(
                [
                    {
                        name: Proposal.name,
                        schema: ProposalSchema,
                    }
                ]
            )
        ],
        providers: [SharedService],
        exports: [SharedService],
    }
)

export class SharedModule { }

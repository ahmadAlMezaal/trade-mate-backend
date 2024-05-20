import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.schema';
import { Proposal, ProposalSchema } from 'src/proposal/entities/proposal.schema';

@Module(
    {
        imports: [
            MongooseModule.forFeature(
                [
                    {
                        name: User.name,
                        schema: UserSchema
                    },
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

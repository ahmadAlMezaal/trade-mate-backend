import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion, Collection } from 'mongodb';
import { DBCollectionTokens, DBCollections } from 'src/types/enums';
import { Proposal } from '../entities/proposal.schema';

export const proposalProviders = [
    {

        inject: [ConfigService],
        provide: DBCollectionTokens.PROPOSALS_COLLECTION,
        useFactory: async (configService: ConfigService): Promise<Collection<Proposal>> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'))
                const proposalCollection = db.collection(DBCollections.PROPOSALS) as Collection<Proposal>;
                return proposalCollection;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

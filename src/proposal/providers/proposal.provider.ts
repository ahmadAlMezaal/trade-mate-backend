import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

export const proposalProviders = [
    {

        inject: [ConfigService],
        provide: 'PROPOSAL_COLLECTION',
        useFactory: async (configService: ConfigService): Promise<Db> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('database.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                return client.db(configService.get<string>('DATABASE'))
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

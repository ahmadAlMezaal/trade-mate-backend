import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion, Collection } from 'mongodb';
import { proposalProviders } from 'src/proposal/providers/proposal.provider';
import { DBCollectionTokens } from 'src/types/enums';
import { userProviders } from 'src/users/providers/user.providers';

export const databaseProviders = [
    {

        inject: [ConfigService],
        provide: DBCollectionTokens.DATABASE_CONNECTION,
        useFactory: async (configService: ConfigService): Promise<Db> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                console.log('Successfully connected to MongoDB'.toUpperCase());
                return client.db(configService.get<string>('DATABASE'));
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }
    },
    ...userProviders,
    ...proposalProviders
    //TODO: Try adding rest of the models here
];

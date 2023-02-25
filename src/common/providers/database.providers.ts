import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion, Collection } from 'mongodb';

export const databaseProviders = [
    {

        inject: [ConfigService],
        provide: 'DATABASE_CONNECTION',
        useFactory: async (configService: ConfigService): Promise<Db> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('database.MONGODB_URI') as string,
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

    }
];

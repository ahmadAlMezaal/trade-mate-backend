import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

export const postsProviders = [
    {

        inject: [ConfigService],
        provide: 'POSTS_COLLECTION',
        useFactory: async (configService: ConfigService): Promise<Db> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('database.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'))
                return db;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

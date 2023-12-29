import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { DBCollections } from 'src/types/enums';
import { User } from 'src/users/entities/user.schema';

export const userProviders = [
    {

        inject: [ConfigService],
        provide: 'USERS_COLLECTION',
        useFactory: async (configService: ConfigService): Promise<Collection<User>> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'))
                const usersCollection = db.collection(DBCollections.USERS) as Collection<User>;
                await usersCollection.createIndex({ email: 1, }, { unique: true });
                return usersCollection;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

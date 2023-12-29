import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { DBCollectionTokens, DBCollections } from 'src/types/enums';
import { Notification } from '../entities/notification.schema';

export const notificationsProviders = [
    {

        inject: [ConfigService],
        provide: DBCollectionTokens.NOTIFICATIONS_COLLECTION,
        useFactory: async (configService: ConfigService): Promise<Collection<Notification>> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'))
                const notificationsCollection = db.collection(DBCollections.NOTIFICATIONS) as Collection<Notification>;
                return notificationsCollection;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

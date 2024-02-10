import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { Book } from '../entities/book.schema';
import { DBCollectionTokens, DBCollections } from 'src/types/enums';

export const booksProviders = [
    {

        inject: [ConfigService],
        provide: DBCollectionTokens.BOOKS_COLLECTION,
        useFactory: async (configService: ConfigService): Promise<Collection<Book>> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'));
                const booksCollection = db.collection(DBCollections.BOOKS) as Collection<Book>;
                await booksCollection.createIndex({ name: 1, }, { unique: true });
                return booksCollection;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

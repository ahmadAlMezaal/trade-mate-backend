import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, ServerApiVersion, Collection } from 'mongodb';
import { Book } from '../entities/book.schema';

export const booksProviders = [
    {

        inject: [ConfigService],
        provide: 'BOOKS_COLLECTION',
        useFactory: async (configService: ConfigService): Promise<Db> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('database.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'))
                const booksCollection = db.collection('books') as Collection<Book>;
                await booksCollection.createIndex({ name: 1, }, { unique: true });
                return db;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

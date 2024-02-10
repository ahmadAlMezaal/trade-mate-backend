import { ConfigService } from '@nestjs/config';
import { MongoClient, ServerApiVersion, Collection } from 'mongodb';
import { DBCollectionTokens, DBCollections } from 'src/types/enums';
import { Listing } from '../entities/listing.schema';

export const listingProviders = [
    {

        inject: [ConfigService],
        provide: DBCollectionTokens.LISTINGS_COLLECTION,
        useFactory: async (configService: ConfigService): Promise<Collection<Listing>> => {
            try {
                const client = await MongoClient.connect(
                    configService.get<string>('DATABASE.MONGODB_URI') as string,
                    {
                        serverApi: ServerApiVersion.v1,
                    }
                );
                const db = client.db(configService.get<string>('DATABASE'));
                const listingsCollection = db.collection(DBCollections.LISTINGS) as Collection<Listing>;
                return listingsCollection;
            } catch (error) {
                console.log('error connecting to MongoDB: ', error);
                throw error;
            }
        }

    }
];

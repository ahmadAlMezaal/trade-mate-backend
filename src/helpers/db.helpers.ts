import { Db, Collection } from 'mongodb';

export const getCollection = <T>(db: Db, collectionName: string): Collection<T> => {
    return db.collection<T>(collectionName);
}
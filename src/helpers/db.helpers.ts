import { Db, Collection } from 'mongodb';

export const getCollection = <T>(db: Db, collectionName: string): Collection<T> => db.collection<T>(collectionName);
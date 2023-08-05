import { Book } from 'src/books/entities/book.schema';
import { PostStatus } from 'src/types/enums';

export class IPost {
    _id: string;
    title: string;
    description: string;
    imageUrls: string[];
    bookInfo: Book;
    postOwnerId: string;
    status?: PostStatus;
    offeredBookInfo: Book;
    proposalsIds?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

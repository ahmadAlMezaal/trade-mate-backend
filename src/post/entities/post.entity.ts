import { Book } from 'src/books/entities/book.schema';

export class IPost {
    _id: string;
    title: string;
    description: string;
    imageUrls: string[];
    bookInfo: Book;
    postOwnerId: string;
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IBook, IGoogleBook } from 'src/types/models';
import { FindBookInput } from './dto/findBook.input';
import { Book, BookDocument } from './entities/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BooksService {

    constructor(
        @InjectModel(Book.name) private readonly bookCollection: Model<BookDocument>,
    ) { }

    // public async create(createBookInput: CreateBookInput, user: User): Promise<Book> {
    //     const book = await this.collection.insertOne({ ...createBookInput });
    //     return {} as Book;
    // }

    findAll() {
        return this.bookCollection.find({});
    }

    async queryBook({ name }: FindBookInput): Promise<IBook[]> {
        const route = `https://www.googleapis.com/books/v1/volumes?q=${name}`;
        try {
            const response = await axios.get(route);
            const books: IBook[] = [];
            if (response.data && response.data.totalItems > 0) {
                const totalBooks = response.data.items.slice(0, 3) as IGoogleBook[];
                for (const book of totalBooks) {
                    const bookInfo = book.volumeInfo;
                    let genres = [];

                    const imageUrls = {
                        smallThumbnail: 'https://books.google.com/books/content?id=1234&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
                        thumbnail: 'https://books.google.com/books/content?id=1234&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
                    };
                    if (book.volumeInfo.imageLinks?.smallThumbnail) {
                        imageUrls.smallThumbnail = book.volumeInfo.imageLinks.smallThumbnail.replace(/^http:\/\//i, 'https://');
                    }
                    if (book.volumeInfo.imageLinks?.thumbnail) {
                        imageUrls.thumbnail = book.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://');
                    }
                    if (bookInfo?.categories) {
                        genres = [...bookInfo.categories];
                    }
                    const bookObj: IBook = {
                        authors: bookInfo?.authors ?? [],
                        description: bookInfo.description,
                        genres,
                        imageUrls,
                        language: bookInfo.language,
                        pdfLink: book.pdf?.acsTokenLink ?? undefined,
                        providerId: book.id,
                        subtitle: bookInfo?.subtitle,
                        title: bookInfo.title,
                        totalPageCount: bookInfo?.pageCount ?? 0,
                    };
                    books.push(bookObj);
                }
            }
            return [...books];
        } catch (error) {
            console.log('error: ', error);
            return [];
        }
    }

    public async getBookByProviderId(id: string): Promise<IBook | null> {
        const route = `https://www.googleapis.com/books/v1/volumes/${id}`;
        try {
            const response = await axios.get(route);
            if (response.data) {
                return this.formatBook(response.data);
            }
            return null;
        } catch (error) {
            console.log('error: ', error);
            return null;
        }
    }

    private formatBook(book: IGoogleBook): IBook {
        const bookInfo = book.volumeInfo;
        let genres = [];
        const imageUrls = {
            smallThumbnail: 'https://books.google.com/books/content?id=1234&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
            thumbnail: 'https://books.google.com/books/content?id=1234&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
        };
        if (book.volumeInfo.imageLinks?.smallThumbnail) {
            imageUrls.smallThumbnail = book.volumeInfo.imageLinks.smallThumbnail.replace(/^http:\/\//i, 'https://');
        }
        if (book.volumeInfo.imageLinks?.thumbnail) {
            imageUrls.thumbnail = book.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://');
        }
        if (bookInfo?.categories) {
            genres = [...bookInfo.categories];
        }
        return {
            authors: bookInfo?.authors ?? [],
            description: bookInfo.description,
            genres,
            imageUrls,
            language: bookInfo.language,
            pdfLink: book.pdf?.acsTokenLink ?? undefined,
            providerId: book.id,
            subtitle: bookInfo?.subtitle,
            title: bookInfo.title,
            totalPageCount: bookInfo?.pageCount ?? 0,
        } as IBook;
    }

    remove(id: number) {
        return `This action removes a #${id} book`;
    }
}

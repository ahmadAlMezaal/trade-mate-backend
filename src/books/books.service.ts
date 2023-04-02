import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Collection, Db } from 'mongodb';
import { IBook, IGoogleBook } from 'src/types/models';
import { User } from 'src/users/schemas/user.schema';
import { CreateBookInput } from './dto/createBook.input';
import { FindBookInput } from './dto/findBook.input';
import { UpdateBookInput } from './dto/updateBook.input';
import { Book } from './entities/book.schema';

@Injectable()
export class BooksService {

    constructor(@Inject('BOOKS_COLLECTION') private readonly db: Db) { }

    private get collection(): Collection<Book> {
        return this.db.collection<Book>('books');
    }

    public async create(createBookInput: CreateBookInput, user: User): Promise<Book> {
        // const book = await this.collection.insertOne({ ...createBookInput });
        return {} as Book
    }

    findAll() {
        return this.collection.find({}).toArray();
    }

    async queryBook({ name }: FindBookInput) {
        const route = `https://www.googleapis.com/books/v1/volumes?q=${name}`
        try {
            const response = await axios.get(route);
            const books: IBook[] = [];
            if (response.data && response.data.totalItems > 0) {
                const totalBooks = response.data.items.slice(0, 3) as IGoogleBook[]

                for (const book of totalBooks) {
                    const bookInfo = book.volumeInfo;
                    const genres = bookInfo?.categories ? [...bookInfo.categories] : [];
                    const imageUrls = bookInfo.imageLinks?.smallThumbnail || bookInfo.imageLinks?.thumbnail ?
                        [bookInfo.imageLinks?.smallThumbnail, bookInfo.imageLinks?.thumbnail] :
                        []
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

    update(id: number, updateBookInput: UpdateBookInput) {
        return `This action updates a #${id} book`;
    }

    remove(id: number) {
        return `This action removes a #${id} book`;
    }
}

import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { User } from 'src/users/schemas/user.schema';
import { BooksResolver } from './books.resolver';
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

    findOne(query: FindBookInput) {
        return this.collection.findOne({ ...query });
    }

    update(id: number, updateBookInput: UpdateBookInput) {
        return `This action updates a #${id} book`;
    }

    remove(id: number) {
        return `This action removes a #${id} book`;
    }
}

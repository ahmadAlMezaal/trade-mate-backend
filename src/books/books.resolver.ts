import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.schema';
import { UpdateBookInput } from './dto/updateBook.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { FindBookInput } from './dto/findBook.input';
import { IBook } from 'src/types/models';

@Resolver(() => Book)
export class BooksResolver {

    constructor(private readonly booksService: BooksService) { }

    @UseGuards(JwtAuthGuard)
    @Query(() => [Book], { name: 'searchBook' })
    async searchBook(@Args('input') input: FindBookInput): Promise<IBook[]> {
        return await this.booksService.queryBook(input);
    }

    @Query(() => [Book], { name: 'books' })
    findAllBooks() {
        return this.booksService.findAll();
    }

    // @Query(() => Book, { name: 'book' })
    // findOne(@Args('id', { type: () => Int }) id: number) {
    //     return this.booksService.findOne(id);
    // }

    @Mutation(() => Book)
    updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
        return this.booksService.update(updateBookInput.id, updateBookInput);
    }

    @Mutation(() => Book)
    removeBook(@Args('id', { type: () => Int }) id: number) {
        return this.booksService.remove(id);
    }
}

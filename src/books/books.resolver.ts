import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.schema';
import { CreateBookInput } from './dto/createBook.input';
import { UpdateBookInput } from './dto/updateBook.input';
import { Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/schemas/user.schema';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@Resolver(() => Book)
export class BooksResolver {

    constructor(private readonly booksService: BooksService) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Book, { name: 'addBook' })
    createBook(@Args('createBookInput') createBookInput: CreateBookInput, @CurrentUser() user: User): Promise<Book> {
        return this.booksService.create(createBookInput, user);
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

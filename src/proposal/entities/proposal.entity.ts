
import { Types } from 'mongoose';
import { Book } from 'src/books/entities/book.schema';
import { ProposalStatus, ProductCondition } from 'src/types/enums';

export class IOffer {
    _id?: Types.ObjectId;
    title?: string;
    additionalInfo: string;
    imageUrls: string[];
    offeredBookInfo: Book;
    offerOwnerId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    productCondition: ProductCondition;
    isApproved?: boolean;
    decision?: ProposalStatus;
}

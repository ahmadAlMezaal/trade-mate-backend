import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';
import { NotificationType } from '../entities/notification.schema';

@InputType()
export class CreateNotificationInput {

    @Field(() => String)
    @IsString()
    senderId: string;

    @Field(() => String)
    @IsString()
    recipientId: string;

    @Field(() => String)
    type: NotificationType;

    @Field(() => String)
    @IsString()
    title: string;

    @Field(() => String)
    @IsString()
    message: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    listingId?: string;
}

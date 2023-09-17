import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsObject } from 'class-validator';
import { NotificationMetadata, NotificationType } from '../entities/notification.schema';

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

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    proposalId?: string;

    @Field(() => NotificationMetadata, { nullable: true })
    @IsOptional()
    @IsObject()
    metadata?: NotificationMetadata;
}

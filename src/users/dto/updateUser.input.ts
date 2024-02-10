
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class BaseUserInput {

    @Field(() => ID, { nullable: true })
    _id?: ObjectId;

    @Field({ nullable: true })
    @IsEmail()
    email?: string;

    @Field({ nullable: true })
    password?: string;
}

@InputType()
export class UpdateUserInput extends BaseUserInput {

    @Field({ nullable: true })
    @IsString()
    @MinLength(2)
    @IsOptional()
    firstName?: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(2)
    lastName?: string;

    @Field({ nullable: true })
    @IsString()
    location?: string;

    @Field(() => Number, { nullable: true })
    @IsBoolean()
    verificationCode?: number;

    @Field(() => Number, { nullable: true })
    @IsBoolean()
    forgotPasswordCode?: number;

    @Field(() => [ObjectId], { nullable: true })
    @IsArray()
    bookmarkedListingIds?: ObjectId[];

    @Field(() => [ObjectId], { nullable: true })
    @IsObject()
    connectionsIds?: ObjectId[];

    @Field(() => Number, { nullable: true })
    @IsNumber()
    reputation?: number;

}

@InputType()
export class DeleteUserInput {
    @Field(() => ID)
    _id: ObjectId;
}
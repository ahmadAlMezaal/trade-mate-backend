
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { IUserLocation } from '../entities/user.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Types } from 'mongoose';

@InputType()
export class BaseUserInput {

    @Field(() => ID, { nullable: true })
    _id?: Types.ObjectId;

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

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    profilePhoto?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsObject()
    @IsOptional()
    location?: IUserLocation;

    @Field(() => Number, { nullable: true })
    @IsBoolean()
    verificationCode?: number;

    @Field(() => Number, { nullable: true })
    @IsBoolean()
    forgotPasswordCode?: number;

    @Field(() => [Types.ObjectId], { nullable: true })
    @IsArray()
    bookmarkedListingIds?: Types.ObjectId[];

    @Field(() => [Types.ObjectId], { nullable: true })
    @IsObject()
    connectionsIds?: Types.ObjectId[];

    @Field(() => Number, { nullable: true })
    @IsNumber()
    reputation?: number;

    @Field(() => [Types.ObjectId], { nullable: true })
    @IsArray()
    pendingUserConnectionRequestsIds?: Types.ObjectId[];

}

@InputType()
export class DeleteUserInput {
    @Field(() => ID)
    _id: Types.ObjectId;
}

@InputType()
export class UpdateUserProfileInput extends BaseUserInput {

    @Field({ nullable: true })
    @IsString()
    @MinLength(2)
    @IsOptional()
    firstName?: string;

    @Field({ nullable: true })
    @IsString()
    @MinLength(2)
    lastName?: string;

    @Field(() => String, { nullable: true })
    @IsArray()
    city?: string;

    @Field(() => String, { nullable: true })
    @IsArray()
    country?: string;

    @Field(() => String, { nullable: true })
    @IsArray()
    isoCountryCode?: string;

    @Field(() => [Types.ObjectId], { nullable: true })
    @IsArray()
    bookmarkedListingIds?: Types.ObjectId[];

    @Field(() => [Types.ObjectId], { nullable: true })
    @IsObject()
    connectionsIds?: Types.ObjectId[];

    @Field(() => Number, { nullable: true })
    @IsNumber()
    reputation?: number;
}
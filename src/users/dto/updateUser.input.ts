
import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';
import { IUserLocation } from '../entities/user.entity';
import { GraphQLJSONObject } from 'graphql-type-json';

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
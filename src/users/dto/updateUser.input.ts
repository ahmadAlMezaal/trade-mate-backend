
import { Optional } from '@nestjs/common';
import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class BaseUserInput {

  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  @IsEmail()
  @Transform(email => email.value.toLowerCase())
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
}

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  _id: ObjectId;
}
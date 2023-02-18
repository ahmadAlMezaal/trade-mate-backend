
import { Optional } from '@nestjs/common';
import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class BaseUserInput {

  @Field(type => ID, { nullable: true })
  _id?: ObjectId;

  @Field({ nullable: true })
  @IsEmail()
  @Transform(email => email.value.toLowerCase())
  email?: string;

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

}

@InputType()
export class DeleteUserInput {
  @Field(() => ID)
  _id: ObjectId;

}
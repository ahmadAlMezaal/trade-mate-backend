
import { Optional } from '@nestjs/common';
import { Field, ID, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class CreateUserInput {

  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  @Transform(email => email.value.toLowerCase())
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @Field({ nullable: true })
  @Optional()
  @IsString()
  location: string;

}
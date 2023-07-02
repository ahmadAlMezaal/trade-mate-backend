import { Field, InputType, ID } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Post } from 'src/post/entities/post.schema';

export enum Role {
  ADMIN = 105,
  TRADER = 36
}

@InputType()
export class CreateUserInput {

  @Field(() => ID, { nullable: true })
  @IsOptional()
  _id?: ObjectId;

  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  @Transform(email => email.value.toLowerCase())
  email: string;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @IsOptional()
  isVerified: boolean;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  location: string;

  @Field(() => String, { defaultValue: Role.TRADER, nullable: true })
  @IsOptional()
  role: string;
}

import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum Role {
    ADMIN = 105,
    TRADER = 36
}

@InputType()
export class CreateUserInput {

    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    email: string;

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
    country: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    isoCountryCode: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    city: string;

}

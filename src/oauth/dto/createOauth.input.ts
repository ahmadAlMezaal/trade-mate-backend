import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class OauthInput {
    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    email: string;

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

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    profilePhoto?: string;
}

@InputType()
export class FacebookAuthDto {
    @IsNotEmpty()
    @Field(() => String)
    identityToken: string;

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

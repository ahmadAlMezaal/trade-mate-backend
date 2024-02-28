import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class LoginInput {

    @Field(() => String, { description: 'email of the user' })
    @IsString()
    email: string;

    @Field(() => String, { description: 'password of the user' })
    @IsString()
    password: string;

    //* The @IsOptional decorator does not work as expected, use the { nullable:true } instead
    @Field(() => String, { nullable: true })
    @IsString()
    country?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    isoCountryCode?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    city?: string;
}
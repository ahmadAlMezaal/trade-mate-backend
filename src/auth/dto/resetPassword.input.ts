import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class ResetPasswordInput {

    @IsNotEmpty()
    @IsEmail()
    @Field(() => String)
    email: string;

    @IsNotEmpty()
    @Field(() => String)
    password: string;
}

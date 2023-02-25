import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class ForgotPasswordInput {

    @IsEmail()
    @IsNotEmpty()
    @Field(() => String)
    // @Transform(email => email.value.toLowerCase()) // not working
    email: string;
}

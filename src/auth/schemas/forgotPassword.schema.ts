import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ForgotPasswordResponse {
    @Field(() => String)
    code: string;

    @Field(() => String)
    message: string;
}

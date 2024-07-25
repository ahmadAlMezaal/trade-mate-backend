import { Field, ID, InputType } from "@nestjs/graphql";
import { Types } from "mongoose";

@InputType()
export class FindUserInput {

    @Field(() => ID, { nullable: true })
    _id?: Types.ObjectId;

    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;

    @Field(() => String, { nullable: true })
    facebookId?: string;

    @Field(() => Number, { nullable: true })
    verificationCode?: number;

    @Field(() => Number, { nullable: true })
    forgotPasswordCode?: number;
}

@InputType()
export class FindSingleUserInput {

    @Field(() => ID, { nullable: true })
    _id?: Types.ObjectId;

    @Field(() => String, { nullable: true })
    email?: string;

}

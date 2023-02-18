import { Field, ID, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongodb";

@InputType()
export class FindUserInput {

    @Field(() => ID, { nullable: true })
    _id?: ObjectId;

    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;
}

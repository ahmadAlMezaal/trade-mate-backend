import { Field, ID, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongodb";

@InputType()
export class FindBookInput {

    @Field(() => ID, { nullable: true })
    _id?: ObjectId;

    @Field(() => String, { nullable: true })
    name?: string;

}

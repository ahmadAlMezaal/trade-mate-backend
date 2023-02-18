import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class PaginationInput {
    @Field((_type) => Int, { nullable: true })
    offset?: number = 0;

    @Field((_type) => Int, { nullable: true })
    limit?: number = 10;
}
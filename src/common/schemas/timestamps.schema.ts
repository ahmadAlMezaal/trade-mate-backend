import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Timestamps {
    @Field(() => Date, { description: 'The date when the entity was created' })
    createdAt?: Date;

    @Field(() => Date, { description: 'The last date when the entity was updated' })
    updatedAt?: Date;
}
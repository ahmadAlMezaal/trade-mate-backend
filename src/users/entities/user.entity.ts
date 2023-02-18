import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class User {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  @Field(() => String, { description: 'Password for the user' })
  password: string;

  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => String, { description: "User's last name" })
  location: string;

}

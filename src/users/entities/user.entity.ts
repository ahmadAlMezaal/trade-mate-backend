import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class User {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  password: string;

  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => String, { description: "User's last name" })
  location: string;

  @Field(() => String, { description: 'User role' })
  role: string;

}

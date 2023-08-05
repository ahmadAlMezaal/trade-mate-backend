import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { Role } from '../dto/createUser.input';

@ObjectType()
export class User {

  @Field(() => ID)
  _id?: ObjectId;

  @Field(() => String, { description: 'Email address of the user' })
  email: string;

  @Field(() => String, { description: "User's password" })
  password: string;

  @Field(() => String, { description: 'To show if the user veirifed their email or not', defaultValue: false })
  isVerified?: boolean;

  @Field(() => String, { description: "User's first name" })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  lastName: string;

  @Field(() => String, { description: "User's location" })
  location: string;

  @Field(() => String, { description: "User's profile picture" })
  profilePhoto?: string;

  @Field(() => [ID], { description: "IDs of posts bookmarked by the user", defaultValue: [] })
  bookmarkedPostIds?: ObjectId[];

  @Field(() => String, { description: 'User role', defaultValue: Role.TRADER })
  role?: Role;

  @Field(() => String, { description: 'Verification code on registration', nullable: true })
  verificationCode?: number;

  @Field(() => String, { description: 'Code used whenever the user wants to reset their password', nullable: true })
  forgotPasswordCode?: number;

  @Field(() => Date, { description: 'The date when the user was created' })
  createdAt?: Date;

  @Field(() => Date, { description: 'The last date when the user was updated' })
  updatedAt?: Date;

}

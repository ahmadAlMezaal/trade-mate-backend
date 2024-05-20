import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../dto/createUser.input';
import { IUserLocation } from './user.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {

  @Field(() => ID)
  _id?: Types.ObjectId;

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

  @Field(() => String, { description: "Facebook ID (users who joined the app with facebook)", nullable: true })
  facebookId?: string;

  @Field(() => GraphQLJSONObject, { description: "Users location attributes" })
  location: IUserLocation;

  @Field(() => String, { description: "User's profile picture" })
  profilePhoto?: string;

  @Field(() => [ID], { description: "IDs of listings bookmarked by the user", defaultValue: [] })
  bookmarkedListingIds?: Types.ObjectId[];

  @Field(() => [ID], { description: "IDs of the proposals sent", defaultValue: [] })
  sentProposalsIds?: Types.ObjectId[];

  @Field(() => String, { description: 'User role', defaultValue: Role.TRADER })
  role?: Role;

  @Field(() => String, { description: 'Verification code on registration', nullable: true })
  verificationCode?: number;

  @Field(() => String, { description: 'Code used whenever the user wants to reset their password', nullable: true })
  forgotPasswordCode?: number;

  @Field(() => Number, { description: 'A number that is responsible for the reputation of the user. The higher the more trusted', nullable: true })
  reputation?: number;

  @Field(() => [ID], { description: 'Other users that connected with the user', nullable: true })
  connectionsIds?: Types.ObjectId[];

  @Field(() => [ID], { description: 'Other users that connected with the user', nullable: true })
  pendingUserConnectionRequestsIds?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;


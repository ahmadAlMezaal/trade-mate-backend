import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from '../dto/createUser.input';
import { IUserLocation } from './user.entity';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {

  @Field(() => ID)
  @Prop({ type: Types.ObjectId })
  _id?: Types.ObjectId;

  @Field(() => String, { description: 'Email address of the user' })
  @Prop({ required: true, type: String })
  email: string;

  @Field(() => String, { description: "User's password" })
  @Prop({ required: true, type: String })
  password: string;

  @Field(() => String, { description: 'To show if the user veirifed their email or not', defaultValue: false })
  @Prop({ type: Boolean })
  isVerified?: boolean;

  @Field(() => String, { description: "User's first name" })
  @Prop({ required: true, type: String })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  @Prop({ required: true, type: String })
  lastName: string;

  @Field(() => String, { description: "Facebook ID (users who joined the app with facebook)", nullable: true })
  @Prop({ type: String })
  facebookId?: string;

  @Field(() => GraphQLJSONObject, { description: "Users location attributes" })
  @Prop({ type: Object })
  location: IUserLocation;

  @Field(() => String, { description: "User's profile picture" })
  @Prop({ type: String })
  profilePhoto?: string;

  @Field(() => [ID], { description: "IDs of listings bookmarked by the user", defaultValue: [] })
  @Prop({ type: [Types.ObjectId] })
  bookmarkedListingIds?: Types.ObjectId[];

  @Field(() => [ID], { description: "IDs of the proposals sent", defaultValue: [] })
  @Prop({ type: [Types.ObjectId] })
  sentProposalsIds?: Types.ObjectId[];

  @Field(() => String, { description: 'User role', defaultValue: Role.TRADER })
  @Prop({ type: String })
  role?: Role;

  @Field(() => String, { description: 'Verification code on registration', nullable: true })
  @Prop({ type: Number })
  verificationCode?: number;

  @Field(() => String, { description: 'Code used whenever the user wants to reset their password', nullable: true })
  @Prop({ type: Number })
  forgotPasswordCode?: number;

  @Field(() => Number, { description: 'A number that is responsible for the reputation of the user. The higher the more trusted', nullable: true })
  @Prop({ type: Number })
  reputation?: number;

  @Field(() => [ID], { description: 'Other users that connected with the user', nullable: true })
  @Prop({ type: [Types.ObjectId] })
  connectionsIds?: Types.ObjectId[];

  @Field(() => [ID], { description: 'Other users that connected with the user', nullable: true })
  @Prop({ type: [Types.ObjectId] })
  pendingUserConnectionRequestsIds?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

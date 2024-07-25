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
  _id?: Types.ObjectId;

  @Field(() => String, { description: 'Email address of the user' })
  @Prop({ required: true, type: String })
  email: string;

  @Field(() => String, { description: "User's password" })
  @Prop({ required: true, type: String })
  password: string;

  @Field(() => String, { description: 'To show if the user veirifed their email or not', defaultValue: false })
  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Field(() => String, { description: "User's first name" })
  @Prop({ required: true, type: String })
  firstName: string;

  @Field(() => String, { description: "User's last name" })
  @Prop({ required: true, type: String })
  lastName: string;

  @Field(() => String, { description: "Facebook ID (users who joined the app with facebook)", nullable: true })
  @Prop({ type: String, default: null, auto: true })
  facebookId: string;

  @Field(() => GraphQLJSONObject, { description: "Users location attributes" })
  @Prop({ type: Object })
  location: IUserLocation;

  @Field(() => String, { description: "User's profile picture" })
  @Prop({ type: String, default: 'https://spng.pngfind.com/pngs/s/676-6764065_default-profile-picture-transparent-hd-png-download.png' })
  profilePhoto?: string;

  @Field(() => [ID], { description: "IDs of listings bookmarked by the user", defaultValue: [] })
  @Prop({ type: [Types.ObjectId], default: [] })
  bookmarkedListingIds: Types.ObjectId[];

  @Field(() => [ID], { description: "IDs of the proposals sent", defaultValue: [] })
  @Prop({ type: [Types.ObjectId], default: [] })
  sentProposalsIds: Types.ObjectId[];

  @Field(() => String, { description: 'User role' })
  @Prop({ type: String, default: Role.TRADER })
  role?: Role;

  @Field(() => String, { description: 'Verification code on registration', defaultValue: null })
  @Prop({ type: Number })
  verificationCode?: number;

  @Field(() => String, { description: 'Code used whenever the user wants to reset their password', defaultValue: null })
  @Prop({ type: Number })
  forgotPasswordCode?: number;

  @Field(() => Number, { description: 'A number that is responsible for the reputation of the user. The higher the more trusted', defaultValue: 0 })
  @Prop({ type: Number, default: 0 })
  reputation: number;

  @Field(() => [ID], { description: 'Other users that connected with the user', defaultValue: [] })
  @Prop({ type: [Types.ObjectId], default: [] })
  connectionsIds: Types.ObjectId[];

  @Field(() => [ID], { description: 'Other users that connected with the user', defaultValue: [] })
  @Prop({ type: [Types.ObjectId], default: [] })
  pendingUserConnectionRequestsIds: Types.ObjectId[];

  @Field(() => Date, { description: 'The date when the entity was created' })
  @Prop({ type: Date })
  createdAt?: Date;

  @Field(() => Date, { description: 'The last date when the entity was updated' })
  @Prop({ type: Date })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;

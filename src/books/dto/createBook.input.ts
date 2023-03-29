import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateBookInput {

  @Field(() => String, { description: 'Official name of the book' })
  @IsNotEmpty()
  name: string;

  @Field(() => String, { description: 'Description of the book' })
  @IsNotEmpty()
  description: string;

  @Field(() => [String])
  @IsString()
  @IsNotEmpty()
  imageUrls: string[];

  @Field(_type => String, { description: 'Genre of the book' })
  genre: string;

  // @Field(() => String, { description: 'The ID of the trader' })
  // traderId: string;

}
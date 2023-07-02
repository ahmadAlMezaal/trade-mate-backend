import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.schema';

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}

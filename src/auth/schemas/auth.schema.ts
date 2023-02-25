import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}

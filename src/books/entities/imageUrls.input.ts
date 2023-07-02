import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType('ImageUrlsInput')
export class ImageUrls {

    @Field(() => String)
    thumbnail: string;

    @Field(() => String)
    smallThumbnail: string;
}
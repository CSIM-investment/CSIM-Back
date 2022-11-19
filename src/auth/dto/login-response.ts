import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/user/methods/user.methods'

@ObjectType()
export class LoginResponse {
  @Field()
  refreshToken: string

  @Field()
  accessToken: string

  @Field(() => User)
  user: User
}

import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  lastName: string

  @Field()
  firstName: string

  @MinLength(10)
  @Field()
  password: string

  @IsEmail()
  @Field()
  email: string
}

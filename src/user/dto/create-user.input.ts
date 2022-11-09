import { InputType, Field } from '@nestjs/graphql'
import { IsEmail, IsPhoneNumber, MinLength } from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  lastName: string

  @Field()
  firstName: string

  @Field()
  username: string

  @MinLength(10)
  @Field()
  password: string

  @IsPhoneNumber()
  @Field()
  phone: string

  @IsEmail()
  @Field()
  email: string
}

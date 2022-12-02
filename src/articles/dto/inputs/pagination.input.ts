import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class PaginationInput {
  @Field(() => Int)
  start: number

  @Field(() => Int)
  end: number
}

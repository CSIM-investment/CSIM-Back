import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from './pagination.input'

@InputType()
export class ArticleFilterInput {
  @Field({ nullable: true })
  search?: string

  @Field({ nullable: true })
  pagination?: PaginationInput

  @Field({ nullable: true })
  symbol?: string
}

import { Field, Int } from '@nestjs/graphql'
import { PaginationInput } from '../../../articles/dto/inputs/pagination.input'
import { ArticleOrderBy } from '../../../articles/enums/article-order-by.enum'
import { OrderDirection } from '../../../articles/enums/order-direction.enum'

export class CryptoFilterInput {
  @Field({ nullable: true })
  search?: string

  @Field({ nullable: true })
  pagination?: PaginationInput

  @Field({ nullable: true })
  symbol?: string
}

export class CryptoOrderInput {
  @Field(() => ArticleOrderBy)
  name: ArticleOrderBy

  @Field(() => OrderDirection)
  direction: OrderDirection
}

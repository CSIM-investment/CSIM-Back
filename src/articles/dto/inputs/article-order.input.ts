import { Field, InputType } from '@nestjs/graphql'
import { ArticleOrderBy } from 'src/articles/enums/article-order-by.enum'
import { OrderDirection } from 'src/articles/enums/order-direction.enum'

@InputType()
export class ArticleOrderInput {
  @Field(() => ArticleOrderBy)
  name: ArticleOrderBy

  @Field(() => OrderDirection)
  direction: OrderDirection
}
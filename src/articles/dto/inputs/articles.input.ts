import { InputType, Field } from '@nestjs/graphql'
import { ArticleFilterInput } from './article-filter.input'
import { ArticleOrderInput } from './article-order.input'

@InputType()
export class ArticlesInput {
  @Field({ nullable: true, defaultValue: {} })
  orderBy: ArticleOrderInput

  @Field({ nullable: true, defaultValue: {} })
  filterBy: ArticleFilterInput
}

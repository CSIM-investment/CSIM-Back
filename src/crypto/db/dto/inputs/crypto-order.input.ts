import { Field, InputType } from '@nestjs/graphql'
import { ArticleOrderBy } from '../../../../articles/enums/article-order-by.enum'
import { CryptoOrderBy } from '../../../enums/crypto-order-by.enum'
import { OrderDirection } from '../../../../articles/enums/order-direction.enum'

@InputType()
export class CryptoOrderInput {
  @Field(() => ArticleOrderBy)
  name: CryptoOrderBy

  @Field(() => OrderDirection)
  direction: OrderDirection
}

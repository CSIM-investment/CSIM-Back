import { Field, InputType } from '@nestjs/graphql'
import { ArticleOrderBy } from '../../../articles/enums/article-order-by.enum'
import { OrderDirection } from '../../../articles/enums/order-direction.enum'

@InputType()
export class InvestmentReportsOrderInput {
    @Field(() => ArticleOrderBy, { nullable: true })
    name?: ArticleOrderBy

    @Field(() => OrderDirection, { nullable: true })
    direction?: OrderDirection
}

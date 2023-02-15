import { InputType, Field, Int, Float } from '@nestjs/graphql'

@InputType()
export class CreateInvestmentInput {
  @Field(() => Int)
  quantity: number

  @Field(() => Float)
  valueBaseCurrency: number

  @Field(() => Float)
  valueQuoteCurrency: number

  @Field()
  quoteCurrencyId: string

  @Field()
  baseCurrencyId: string
}

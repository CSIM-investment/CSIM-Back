import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '../../../../articles/dto/inputs/pagination.input'
import { CryptoMarketSearchInput } from './crypto-market-search.input'

@InputType()
export class CryptoFilterInput {
  @Field({ nullable: true })
  search?: CryptoMarketSearchInput

  @Field({ nullable: true })
  pagination?: PaginationInput

  @Field({ nullable: true })
  symbol?: string
}

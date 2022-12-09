import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '../../../../articles/dto/inputs/pagination.input'
import { CryptoMarketInput } from '../cryptoMarket-create.dto'

@InputType()
export class CryptoFilterInput {
  @Field({ nullable: true })
  search?: CryptoMarketInput

  @Field({ nullable: true })
  pagination?: PaginationInput

  @Field({ nullable: true })
  symbol?: string
}

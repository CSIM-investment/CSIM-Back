import { Field, InputType } from '@nestjs/graphql'
import { CryptoOrderInput } from './inputs/crypto-order.input'
import { CryptoFilterInput } from './inputs/crypto-filter.input'

@InputType()
export class CryptoSearchInput {
  @Field({ nullable: true, defaultValue: {} })
  orderBy?: CryptoOrderInput

  @Field({ nullable: true, defaultValue: {} })
  filterBy?: CryptoFilterInput
}

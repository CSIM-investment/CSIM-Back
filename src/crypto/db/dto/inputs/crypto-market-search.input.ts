import { Field, InputType, ObjectType, ID } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'

@InputType()
export class CryptoMarketSearchInput {
  @Field({ nullable: true })
  id: string

  @Field({ nullable: true })
  name: string

  @Field({ nullable: true })
  image: string

  @Field({ nullable: true })
  current_price: number

  @Field({ nullable: true })
  market_cap: number

  @Field({ nullable: true })
  market_cap_rank: number

  @Field({ nullable: true })
  fully_diluted_valuation: number

  @Field({ nullable: true })
  total_volume: number

  @Field({ nullable: true })
  high_24h: number

  @Field({ nullable: true })
  low_24h: number

  @Field({ nullable: true })
  price_change_24h: number

  @Field({ nullable: true })
  price_change_percentage_24h: number

  @Field({ nullable: true })
  market_cap_change_24h: number

  @Field({ nullable: true })
  market_cap_change_percentage_24h: number

  @Field({ nullable: true })
  circulating_supply: number

  @Field({ nullable: true })
  total_supply: number

  @Field({ nullable: true })
  max_supply: number

  @Field({ nullable: true })
  ath: number

  @Field({ nullable: true })
  ath_change_percentage: number

  @Field({ nullable: true })
  ath_date: Date

  @Field({ nullable: true })
  atl: number

  @Field({ nullable: true })
  atl_change_percentage: number

  @Field({ nullable: true })
  atl_date: Date

  @Field({ nullable: true })
  roi: string

  @Field({ nullable: true })
  last_updated: Date
}

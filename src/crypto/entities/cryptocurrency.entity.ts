import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm'
import { ObjectType, Field, Float, ID } from '@nestjs/graphql'
import { InvestmentEntity } from 'src/investments/entities/investment.entity'

@Entity()
@ObjectType()
export class CryptoCurrencyMarket {
  @PrimaryColumn()
  @Field(() => ID)
  id: string

  @Field(() => Float)
  @Column({ type: 'float' })
  current_price: number

  @Field()
  @Column({ type: 'float' })
  market_cap: number

  @Field()
  @Column({ type: 'int' })
  market_cap_rank: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  fully_diluted_valuation: number

  @Field()
  @Column({ type: 'float' })
  total_volume: number

  @Field()
  @Column({ type: 'float' })
  high_24h: number

  @Field()
  @Column({ type: 'float' })
  low_24h: number

  @Field()
  @Column({ type: 'float' })
  price_change_24h: number

  @Field()
  @Column({ type: 'float' })
  price_change_percentage_24h: number

  @Field()
  @Column({ type: 'float' })
  market_cap_change_24h: number

  @Field()
  @Column({ type: 'float' })
  market_cap_change_percentage_24h: number

  @Field()
  @Column({ type: 'float' })
  circulating_supply: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  total_supply: number

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  max_supply: number

  @Field()
  @Column({ type: 'float' })
  ath: number

  @Field()
  @Column({ type: 'float' })
  ath_change_percentage: number

  @Field()
  @Column({ type: 'timestamp' })
  ath_date: Date

  @Field()
  @Column({ type: 'float' })
  atl: number

  @Field()
  @Column({ type: 'float' })
  atl_change_percentage: number

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  atl_date: Date

  @Field({ nullable: true })
  @Column({ nullable: true })
  roi: string

  @Field()
  @Column({ type: 'timestamp' })
  last_updated: Date

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  symbol: string

  @Field()
  @Column()
  image: string

  @OneToMany(() => InvestmentEntity, ({ baseCurrency }) => baseCurrency)
  baseInvestment: InvestmentEntity[]

  @OneToMany(() => InvestmentEntity, ({ quoteCurrency }) => quoteCurrency)
  quoteInvestment: InvestmentEntity[]
}

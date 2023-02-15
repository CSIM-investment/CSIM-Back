import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { User } from 'src/user/methods/user.methods'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'investment' })
@ObjectType()
export class InvestmentEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @CreateDateColumn()
  @Field(() => Date)
  creationDate: Date

  @Column({ type: 'int' })
  @Field(() => Int)
  quantity: number

  @Column({ type: 'float' })
  @Field(() => Float)
  valueBaseCurrency: number

  @Column({ type: 'float' })
  @Field(() => Float)
  valueQuoteCurrency: number

  @ManyToOne(() => User, (user: User) => user.investments)
  user: User

  @Field(() => CryptoCurrencyMarket)
  @ManyToOne(() => CryptoCurrencyMarket, ({ quoteInvestment }) => quoteInvestment)
  quoteCurrency: CryptoCurrencyMarket

  @Field(() => CryptoCurrencyMarket)
  @ManyToOne(() => CryptoCurrencyMarket, ({ baseInvestment }) => baseInvestment)
  baseCurrency: CryptoCurrencyMarket
}
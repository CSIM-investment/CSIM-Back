import { ObjectType, Field, ID, Float } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { User } from 'src/user/methods/user.methods'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({ name: 'investment' })
@ObjectType()
export class InvestmentEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Field()
    type: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Field()
    status: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    @Field()
    origin: string

    @CreateDateColumn()
    @Field(() => Date)
    creationDate: Date

    @Column({ type: 'float', default: 1 })
    @Field(() => Float)
    quantity: number

    @Column({ type: 'float' })
    @Field(() => Float)
    valueBaseCurrency: number

    @Column({ type: 'float' })
    @Field(() => Float)
    valueQuoteCurrency: number

    @CreateDateColumn()
    @Field(() => Date)
    dateOfInvestment: Date

    @ManyToOne(() => User, (user: User) => user.investments)
    user: User

    @Field(() => CryptoCurrencyMarket, { nullable: true })
    @ManyToOne(
        () => CryptoCurrencyMarket,
        ({ quoteInvestment }) => quoteInvestment,
        { eager: true },
    )
    quoteCurrency: CryptoCurrencyMarket

    @Field(() => CryptoCurrencyMarket, { nullable: true })
    @ManyToOne(
        () => CryptoCurrencyMarket,
        ({ baseInvestment }) => baseInvestment,
        { eager: true },
    )
    baseCurrency: CryptoCurrencyMarket

    @Column({ type: 'float', nullable: true })
    @Field(() => Float)
    amount: number
}

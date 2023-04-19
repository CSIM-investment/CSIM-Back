import { ObjectType, Field, Float } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { Entity } from 'typeorm'

@Entity({ name: 'dashboard' })
@ObjectType()
export class DashboardEntity {
    @Field(() => Float)
    newSold: number

    @Field(() => Float)
    lastSold: number

    @Field(() => Float)
    diffSold: number

    @Field(() => Float)
    spent: number

    @Field(() => [CryptoCurrencyMarket])
    fourthCryptos: [CryptoCurrencyMarket]
}

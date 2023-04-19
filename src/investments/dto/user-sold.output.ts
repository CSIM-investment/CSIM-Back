import { Field, Float, ObjectType } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'

@ObjectType()
export class UserSold {
    @Field(() => Float)
    newSold: number

    @Field(() => Float)
    lastSold: number

    @Field(() => [CryptoCurrencyMarket])
    fourthCryptos: CryptoCurrencyMarket[]

    @Field(() => Float)
    soldRatio: number

    @Field(() => Float)
    currentSold: number
}

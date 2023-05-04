import { Field, Float, ObjectType } from '@nestjs/graphql'
import { InvestmentEntity } from '../entities/investment.entity'

@ObjectType()
export class UserSold {
    @Field(() => Float)
    newSold: number

    @Field(() => Float)
    lastSold: number

    @Field(() => [InvestmentEntity])
    lastInvestments: InvestmentEntity[]

    @Field(() => [InvestmentEntity])
    topInvestments: InvestmentEntity[]

    @Field(() => Float)
    soldRatio: number

    @Field(() => Float)
    currentSold: number
}

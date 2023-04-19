import { UseGuards } from '@nestjs/common'
import {
    Args,
    Context,
    Mutation,
    Parent,
    ResolveField,
    Resolver,
    Query,
} from '@nestjs/graphql'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateInvestmentInput } from './dto/createInvestments.input'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentService } from './investment.service'
import { User } from 'src/user/methods/user.methods'
import { UserService } from 'src/user/user.service'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { DashboardEntity } from './entities/dashboard.entity'

@Resolver(() => InvestmentEntity)
export class InvestmentResolver {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly userService: UserService,
        private readonly coingeckoService: CoingeckoService,
    ) {}

    @Mutation(() => InvestmentEntity)
    @UseGuards(JwtAuthGuard)
    createInvestment(
        @Args('createInvestmentInput')
        createInvestmentInput: CreateInvestmentInput,
        @Context() context,
    ): Promise<InvestmentEntity> {
        return this.investmentService.createInvestment(
            context.req.user.id,
            createInvestmentInput,
        )
    }

    @ResolveField(() => [InvestmentEntity])
    @UseGuards(JwtAuthGuard)
    investments(@Parent() { id }: User): Promise<InvestmentEntity[]> {
        return this.investmentService.getInvestementsByUserId(id)
    }

    @Query(() => [DashboardEntity])
    // eslint-disable-next-line @typescript-eslint/ban-types
    async dashboard(@Args('id') id: number): Promise<{}> {
        const newSold = await this.sold(id)
        const lastSold = await this.lastSold(id)
        const fourthCryptos = await this.fourthCryptos()

        const diffSold = newSold / lastSold

        const spent = 2000.22
        const datas = {
            newSold: newSold,
            lastSold: lastSold,
            diffSold: diffSold,
            spent: spent,
            fourthCryptos: fourthCryptos,
        }
        console.log(datas)
        return datas
    }

    @Query(() => Number)
    async sold(@Args('id') id: number): Promise<number> {
        return await this.investmentService.soldUser(id)
    }

    @Query(() => Number)
    async lastSold(@Args('id') id: number): Promise<number> {
        return await this.userService.getUserSold(id)
    }

    @Query(() => Number)
    async fourthCryptos(): Promise<CryptoCurrencyMarket[]> {
        return await this.coingeckoService.getFourthCryptos()
    }
}

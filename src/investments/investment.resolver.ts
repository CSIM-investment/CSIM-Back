import { UseGuards } from '@nestjs/common'
import {
    Args,
    Context,
    Mutation,
    Parent,
    ResolveField,
    Resolver,
} from '@nestjs/graphql'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateInvestmentInput } from './dto/createInvestments.input'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentService } from './investment.service'
import { User } from 'src/user/methods/user.methods'
import { UserService } from 'src/user/user.service'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'

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

    @ResolveField(() => [InvestmentEntity])
    @UseGuards(JwtAuthGuard)
    fourthBiggestInvestment(
        @Parent() { id }: User,
    ): Promise<InvestmentEntity[]> {
        return this.investmentService.fourthBiggestInvestment(id)
    }

    @ResolveField(() => [InvestmentEntity])
    @UseGuards(JwtAuthGuard)
    fourthLastInvestment(@Parent() { id }: User): Promise<InvestmentEntity[]> {
        return this.investmentService.fourthLastInvestment(id)
    }
}

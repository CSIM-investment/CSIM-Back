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
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentService } from './services/investment.service'
import { ImportInvestmentService } from './services/import-investments.service'

@Resolver(() => InvestmentEntity)
export class InvestmentResolver {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly importInvestmentService: ImportInvestmentService,
    ) {}

    @Mutation(() => [InvestmentEntity])
    @UseGuards(JwtAuthGuard)
    importInvestments(
        @Args('link') link: string,
        @Context() context,
    ): Promise<InvestmentEntity[]> {
        return this.importInvestmentService.run(context.req.user, link)
    }
}

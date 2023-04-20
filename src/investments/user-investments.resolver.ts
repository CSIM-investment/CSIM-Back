import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentService } from './services/investment.service'
import { User } from 'src/user/methods/user.methods'

@Resolver(() => User)
export class UserInvestmentsResolver {
    constructor(private readonly investmentService: InvestmentService) {}

    @ResolveField(() => [InvestmentEntity])
    @UseGuards(JwtAuthGuard)
    investments(@Parent() { id }: User): Promise<InvestmentEntity[]> {
        return this.investmentService.getInvestementsByUserId(id)
    }
}

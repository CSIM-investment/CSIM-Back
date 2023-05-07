import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { User } from 'src/user/methods/user.methods'
import { UserSold } from './dto/user-sold.output'
import { UserService } from 'src/user/user.service'
import { InvestmentService } from './services/investment.service'

@Resolver(() => User)
export class SoldResolver {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly userService: UserService,
    ) {}

    @ResolveField(() => UserSold)
    async sold(@Parent() { id, sold: currentSold }: User): Promise<UserSold> {
        const [
            newSold,
            lastSold,
            lastInvestments,
            topInvestments,
            latestBigInvestments,
        ] = await Promise.all([
            this.investmentService.soldUser(id),
            this.userService.getUserSold(id),
            this.investmentService.getMostRecentInvestments(id),
            this.investmentService.getTopInvestments(id),
            this.investmentService.getLatestBigInvestments(id),
        ])
        const soldRatio = lastSold === 0 ? 0 : newSold / lastSold

        await latestBigInvestments.forEach((latestBigInvestments) => {
            latestBigInvestments.valueBaseCurrency =
                latestBigInvestments.valueBaseCurrency *
                latestBigInvestments.quantity
            latestBigInvestments.amount =
                latestBigInvestments.valueBaseCurrency *
                latestBigInvestments.quantity
        })

        const sold: UserSold = {
            newSold,
            lastSold,
            lastInvestments,
            latestBigInvestments,
            soldRatio,
            currentSold,
            topInvestments,
        }

        return sold
    }
}

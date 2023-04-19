import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { User } from 'src/user/methods/user.methods'
import { UserSold } from './dto/user-sold.output'
import { InvestmentService } from './investment.service'
import { UserService } from 'src/user/user.service'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'

@Resolver(() => User)
export class SoldResolver {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly userService: UserService,
        private readonly coingeckoService: CoingeckoService,
    ) {}

    @ResolveField(() => UserSold)
    async sold(@Parent() { id, sold: currentSold }: User): Promise<UserSold> {
        const newSold = await this.investmentService.soldUser(id)
        const lastSold = await this.userService.getUserSold(id)
        const fourthCryptos = await this.coingeckoService.getFourthCryptos()
        const soldRatio = newSold / lastSold

        const sold: UserSold = {
            newSold,
            lastSold,
            fourthCryptos,
            soldRatio,
            currentSold,
        }

        console.log({ sold })

        return sold
    }
}

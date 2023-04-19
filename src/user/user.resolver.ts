import {
    Resolver,
    Mutation,
    Args,
    Context,
    Query,
    ResolveField,
    Parent,
    Float,
} from '@nestjs/graphql'
import { UserService } from './user.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './methods/user.methods'
import { ToggleFavoriteInput } from './dto/toggle-favorite.input'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { InvestmentService } from 'src/investments/investment.service'

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly investmentService: InvestmentService,
    ) {}

    @Mutation(() => User)
    @UseGuards(JwtAuthGuard)
    updateAccount(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @Context() context,
    ): Promise<User> {
        return this.userService.updateAndGet(
            context.req.user.id,
            updateUserInput,
        )
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    account(@Context() context): Promise<User> {
        return context.req.user
    }

    @Mutation(() => User)
    @UseGuards(JwtAuthGuard)
    toggleFavoriteCrypto(
        @Args('input') input: ToggleFavoriteInput,
        @Context() context,
    ): Promise<User> {
        return this.userService.toggleFavoriteCrypto(context.req.user.id, input)
    }

    @ResolveField(() => [CryptoCurrencyMarket])
    async favoritesCrypto(
        @Parent() { id }: User,
    ): Promise<CryptoCurrencyMarket[]> {
        const user = await this.userService.getUserWithFavoritesCrypto(id)
        return user.favoritesCrypto
    }

    @ResolveField(() => Float)
    async sold(@Parent() { id }: User): Promise<number> {
        return this.userService.getUserSold(id)
    }
}

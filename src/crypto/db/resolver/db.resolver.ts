import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { DbService } from '../service/db.service'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'
import { Cron } from '@nestjs/schedule'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'
import { CryptoCurrencyMarketPaginatedResults } from '../dto/crypto-paginated-results'

@Resolver(CryptoCurrencyMarket)
export class DbMutationResolver {
    constructor(
        private cryptoService: DbService,
        private coinGeckoService: CoingeckoService,
    ) {}

    // @Cron('10 * * * * *')
    @Mutation(() => String)
    async createCryptoMarket(): Promise<string> {
        this.coinGeckoService.getAllCoinsMarket().then((resp) => {
            resp.forEach((elmnt) => {
                this.cryptoService.createCryptoCurrencyMarket(elmnt)
            })
        })
        return 'datas has been created'
    }

    @Query(() => CryptoCurrencyMarketPaginatedResults)
    async cryptos(
        @Args('options') options?: CryptoSearchInput,
    ): Promise<CryptoCurrencyMarketPaginatedResults> {
        return await this.cryptoService.search(options)
    }
}

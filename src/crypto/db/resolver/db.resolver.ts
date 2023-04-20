import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { DbService } from '../service/db.service'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'
import { Cron } from '@nestjs/schedule'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'
import { CryptoCurrencyMarketPaginatedResults } from '../dto/crypto-paginated-results'
import { CryptoMarketInput } from '../dto/cryptoMarket-create.dto'

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
        this.cryptoService.createCryptoCurrencyMarket({
            name: 'euro',
            ath: 1,
            atl: 1,
            ath_change_percentage: 0,
            ath_date: new Date(Date.now()),
            atl_change_percentage: 0,
            atl_date: new Date(Date.now()),
            circulating_supply: 0,
            current_price: 1,
            fully_diluted_valuation: 0,
            high_24h: 1,
            market_cap: 0,
            image: 'https://media.istockphoto.com/id/1173483815/fr/vectoriel/euro-sign-ic%C3%B4ne-de-glyphe-vectoriel.jpg?s=612x612&w=0&k=20&c=E_nl-VaEtDVxTLKIE0EKl3tO8F_Sr3eSBArVQjeNJzI=',
            low_24h: 1,
            market_cap_change_24h: 1,
            last_updated: new Date(Date.now()),
            market_cap_rank: 0,
            market_cap_change_percentage_24h: 0,
            max_supply: 0,
            roi: '',
            price_change_24h: 0,
            symbol: 'eur',
            id: 'euro',
            price_change_percentage_24h: 0,
            total_supply: 0,
            total_volume: 0,
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

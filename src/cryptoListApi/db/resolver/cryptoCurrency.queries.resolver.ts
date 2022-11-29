import { Query, Resolver } from '@nestjs/graphql'
import { CoingeckoService } from 'src/cryptoListApi/coingecko/coingecko/service/coingecko.service';
import { CryptoCurrencyMarket } from '../../model/cryptocurrency.entity'

@Resolver( CryptoCurrencyMarket )
export class CryptoCurrencyMarketQueriesResolver {

    constructor(
        private readonly cryptoCurrencyMarketService : CryptoCurrencyMarket,
        private coinGeckoSevice     : CoingeckoService
    ) { }

    @Query( () => [CryptoCurrencyMarket])
    async cryptoMarketList ( vs_currency : string ) {
        return this.coinGeckoSevice.getAllCoinsMarket( vs_currency );
    }
}
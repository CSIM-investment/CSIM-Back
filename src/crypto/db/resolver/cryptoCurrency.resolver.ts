import { Query, Resolver } from '@nestjs/graphql'
import { Observable } from 'rxjs';
import { CoingeckoService } from 'src/crypto/coingecko/coingecko/service/coingecko.service';
import { CryptoCurrencyMarket } from '../../model/cryptocurrency.entity'
import { DbService } from '../service/db.service';

@Resolver( CryptoCurrencyMarket )
export class CryptoCurrencyMarketQueriesResolver {

    constructor(
        private coinGeckoService                : CoingeckoService,
        private dbService                       : DbService
    ) { }

    @Query( () => [CryptoCurrencyMarket])
    cryptoMarketList (): void {
        
    }
}
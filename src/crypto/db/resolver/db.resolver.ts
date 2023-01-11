import { Args, Mutation, Resolver, Query, InputType } from '@nestjs/graphql'
import { CryptoMarketOutput } from '../dto/cryptoMarket-create.dto'
import { DbService } from '../service/db.service'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'
import { CoingeckoService } from 'src/crypto/coingecko/coingecko/service/coingecko.service'
import { Cron } from '@nestjs/schedule'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'
import { CryptoCurrencyMarketPaginatedResults } from '../dto/crypto-paginated-results'

@Resolver(CryptoCurrencyMarket)
export class DbMutationResolver {
	constructor(private cryptoService: DbService, private coinGeckoService: CoingeckoService) { }

	@Cron('10 * * * * *')
	@Mutation(() => CryptoMarketOutput)
	async createCryptoMarket() {
		return this.coinGeckoService.getAllCoinsMarket().then((resp) => {
			resp.forEach((elmnt) => {
				this.cryptoService.createCryptoCurrencyMarket(elmnt)
			})
		})
	}

	@Query(() => CryptoCurrencyMarketPaginatedResults)
	async cryptos(@Args('options') options?: CryptoSearchInput): Promise<CryptoCurrencyMarketPaginatedResults> {
		return await this.cryptoService.search(options)
	}
}

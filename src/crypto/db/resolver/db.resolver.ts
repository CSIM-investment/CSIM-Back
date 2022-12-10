import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql'
import { CryptoMarketOutput } from '../dto/cryptoMarket-create.dto'
import { DbService } from '../service/db.service'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'
import { UpdateCryptoInput, UpdateCryptoOutput } from '../dto/cryptoMarket-update.dto'
import { CoingeckoService } from 'src/crypto/coingecko/coingecko/service/coingecko.service'
import { Cron } from '@nestjs/schedule'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'

@Resolver(CryptoCurrencyMarket)
export class DbMutationResolver {
  constructor(private cryptoService: DbService, private coinGeckoService: CoingeckoService) {}

  @Cron('10 * * * * *')
  @Mutation(() => CryptoMarketOutput)
  async createCryptoMarket() {
    return this.coinGeckoService.getAllCoinsMarket().then((resp) => {
      resp.forEach((elmnt) => {
        this.cryptoService.createCryptoCurrencyMarket(elmnt)
      })
    })
  }

  @Query(() => [CryptoCurrencyMarket])
  cryptos(@Args('options') options?: CryptoSearchInput): Promise<CryptoCurrencyMarket[]> {
    return this.cryptoService.search(options)
  }
}

import { CoingeckoService } from "src/cryptoListApi/coingecko/coingecko/service/coingecko.service";
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CryptoMarketInput, CryptoMarketOutput } from "../dto/cryptoMarket-create.dto";
import { DbService } from "../service/db.service";
import { CryptoCurrencyMarket } from "src/cryptoListApi/model/cryptocurrency.entity";
import { UpdateCryptoInput, UpdateCryptoOutput } from "../dto/cryptoMarket-update.dto";

@Resolver(CryptoCurrencyMarket)
export class DbMutationResolver {

    constructor(
        private dbService : DbService
    ) {}

    @Mutation( () => UpdateCryptoOutput )
    async createCryptoMarket (@Args('input') input: UpdateCryptoInput) {
        return this.dbService.createCryptoCurrencyMarket( input );
    }

    @Mutation( () => UpdateCryptoOutput )
    async updateCryptoMarket (@Args({ name : 'cryptoMarketId', type: () => ID}) cryptoMarketId : CryptoCurrencyMarket['id']  , @Args('input') input: UpdateCryptoInput) {
        return this.dbService.updateCryptoCurrencyMarket( cryptoMarketId, input );
    }

}
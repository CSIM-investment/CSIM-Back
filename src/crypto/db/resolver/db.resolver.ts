import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql'
import { CryptoMarketInput, CryptoMarketOutput } from "../dto/cryptoMarket-create.dto";
import { DbService } from "../service/db.service";
import { CryptoCurrencyMarket } from "src/crypto/model/cryptocurrency.entity";
import { UpdateCryptoInput, UpdateCryptoOutput } from "../dto/cryptoMarket-update.dto";
import { CryptoCurrencyMarketPagination, CryptoCurrencyMarketPaginationArgs } from "../pagination/dto/cryptoCurrencymarket-pagination.dto";
import { YahooFinanceService } from "../service/yahoo-finance.service";
import { CoingeckoService } from 'src/crypto/coingecko/coingecko/service/coingecko.service';
import { Cron } from '@nestjs/schedule';

@Resolver(CryptoCurrencyMarket)
export class DbMutationResolver {

    constructor(
        private dbService           : DbService,
        private coinGeckoService    : CoingeckoService
    ) {}

    @Cron('10 * * * * *')
    @Mutation( () => CryptoMarketOutput )
    async createCryptoMarket () {

        return this.coinGeckoService.getAllCoinsMarket().then( resp => {
            resp.forEach( elmnt => {
                this.dbService.createCryptoCurrencyMarket( elmnt );
            });
        });
    }

    @Mutation( () => UpdateCryptoOutput )
    async updateCryptoMarket (@Args({ name : 'cryptoMarketId', type: () => ID}) cryptoMarketId : CryptoCurrencyMarket['id']  , @Args('input') input: UpdateCryptoInput) {
        return this.dbService.updateCryptoCurrencyMarket( cryptoMarketId, input );
    }

    @Query( () => CryptoCurrencyMarketPagination)
    async crytpoCurrencyMarketPagination(@Args() args: CryptoCurrencyMarketPaginationArgs) {
        
        let cryptos : any[] = [];

        this.dbService.cryptoCurrencyMarketPagination(args).then(
            (datas) => {
                for ( let i = 0; i < args.skip; i++ ) {

                    let aze = new YahooFinanceService(datas.nodes[i].name);
                    aze.getHistory(new Date()).then(
                        (data) => {
                            console.log(data);
                            
                        }
                    )
                }
            }
        )
        return cryptos;
    }

    @Query( returns => CryptoCurrencyMarket)
    async getCryptoCurrencyById( @Args('id', { type: () => String}) id : number) {
        // return this.dbService.getCryptoById(id);
    }

}
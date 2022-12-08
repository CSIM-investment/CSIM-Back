import { Injectable } from '@nestjs/common';
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoMarketInput, CryptoMarketOutput } from '../dto/cryptoMarket-create.dto';
import { UpdateCryptoInput, UpdateCryptoOutput } from '../dto/cryptoMarket-update.dto';
import { CryptoCurrencyMarketPagination, CryptoCurrencyMarketPaginationArgs } from '../pagination/dto/cryptoCurrencymarket-pagination.dto';

@Injectable()
export class DbService {
    
    constructor(
        @InjectRepository(CryptoCurrencyMarket)
        private readonly cryptoRepository: Repository<CryptoCurrencyMarket>,

    ) {}

    async createCryptoCurrencyMarket ( input : CryptoMarketInput ) : Promise<CryptoMarketOutput> {  

        const cryptoCurrencyMarket = this.cryptoRepository.create( input );
        console.log(cryptoCurrencyMarket)
        await this.cryptoRepository.save( cryptoCurrencyMarket );
        return {cryptoCurrencyMarket};
    }

    async updateCryptoCurrencyMarket (cryptoMarketId : CryptoCurrencyMarket['id'], input : UpdateCryptoInput ) : Promise<CryptoCurrencyMarket> {

        //TODO get by object and not id ?
        const cryptoMarket = await this.cryptoRepository.findOneByOrFail( input );
        cryptoMarket.symbol                           = input.symbol;
        cryptoMarket.name                             = input.name;
        cryptoMarket.image                            = input.image;
        cryptoMarket.current_price                    = input.current_price;
        cryptoMarket.market_cap                       = input.market_cap;
        cryptoMarket.market_cap_rank                  = input.market_cap_rank;
        cryptoMarket.fully_diluted_valuation          = input.fully_diluted_valuation;
        cryptoMarket.total_volume                     = input.total_volume;
        cryptoMarket.high_24h                         = input.high_24h;
        cryptoMarket.low_24h                          = input.low_24h;
        cryptoMarket.price_change_24h                 = input.price_change_24h;
        cryptoMarket.price_change_percentage_24h      = input.price_change_percentage_24h;
        cryptoMarket.market_cap_change_24h            = input.market_cap_change_24h;
        cryptoMarket.market_cap_change_percentage_24h = input.market_cap_change_percentage_24h;
        cryptoMarket.circulating_supply               = input.circulating_supply;
        cryptoMarket.total_supply                     = input.total_supply;
        cryptoMarket.max_supply                       = input.max_supply;
        cryptoMarket.ath                              = input.ath;
        cryptoMarket.ath_change_percentage            = input.ath_change_percentage;
        cryptoMarket.ath_date                         = input.ath_date;
        cryptoMarket.atl                              = input.atl;
        cryptoMarket.atl_change_percentage            = input.atl_change_percentage;
        cryptoMarket.atl_date                         = input.atl_date;
        cryptoMarket.roi                              = input.roi;
        cryptoMarket.last_updated                     = input.last_updated;

        await this.cryptoRepository.save( cryptoMarket );
        return cryptoMarket;
    }

    async cryptoMarketList(): Promise<CryptoCurrencyMarket[]> {
        return this.cryptoRepository.find();
    }

    async cryptoCurrencyMarketPagination( args : CryptoCurrencyMarketPaginationArgs ) : Promise<CryptoCurrencyMarketPagination> {

        const [nodes, totalCount] = await this.cryptoRepository.findAndCount({
            take : args.take,
            skip: args.skip,
            // order: {
            //     createdAt: 
            //         args.sortBy?.createdAt === SortDirection.ASC ? 'ASC' : 'DESC'
            // }
        });

        return {nodes, totalCount};
    }
}

import { Injectable } from '@nestjs/common'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { CryptoMarketInput, CryptoMarketOutput } from '../dto/cryptoMarket-create.dto'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'
import { YahooFinanceService } from './yahoo-finance.service'

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(CryptoCurrencyMarket)
    private readonly cryptoRepository: Repository<CryptoCurrencyMarket>,
  ) {}

  async createCryptoCurrencyMarket(input: CryptoMarketInput): Promise<CryptoMarketOutput> {

    const cryptoCurrencyMarket = this.cryptoRepository.create(input)
    await this.cryptoRepository.save(cryptoCurrencyMarket)
    return { cryptoCurrencyMarket }
  }

  async search(cryptosInput: CryptoSearchInput): Promise<CryptoCurrencyMarket[]> {

    const { orderBy, filterBy } = cryptosInput
    const { symbol, pagination, search } = filterBy

    let query = this.cryptoRepository.createQueryBuilder().select()

    const searchKeys = [
        "id", "name", "symbol", "image",
        "current_price", "market_cap", "market_cap_rank", "fully_diluted_valuation", "total_volume", "high_24h", "low_24h", "price_change_24h", "price_change_percentage_24h", 
        "price_change_percentage_24h", "market_cap_change_24h", "market_cap_change_percentage_24h", "circulating_supply", "total_supply", "max_supply", "ath", "ath_change_percentage", "atl", "atl_change_percentage"
    ]

    if (symbol) query = query.where(`symbol = :symbol`, { symbol })

    if ( search ) {
      query = query.andWhere(
        new Brackets((qb) => searchKeys.forEach( key => { 
            if ( search[key] === undefined) return 
            
            const isStringKey = typeof search[key] === 'string'
            
            return isStringKey 
                ? qb.orWhere(`${key} LIKE :${key}`, { [key]: `%${ search[key] }%` })
                : qb.orWhere(`${key} = :${key}`, { [key]: search[key] })
        })))
    }    

    // Filters
    if (filterBy) {

      if (filterBy.max_cap) {
        query = query.andWhere( `market_cap < ${filterBy.max_cap}` )
      }

      if (filterBy.min_cap) {
        query = query.andWhere( `market_cap > ${filterBy.min_cap}` )
      }

      if (filterBy.max_current_price) {
        query = query.andWhere( `current_price < ${filterBy.max_current_price}` )
      }

      if (filterBy.min_current_price) {
        query = query.andWhere( `current_price > ${filterBy.min_current_price}` )
      }

    }

    if (pagination) query = query.limit(pagination.end).offset(pagination.start)
    if (orderBy) query = query.orderBy(orderBy.name, orderBy.direction)

    return await query.getMany()
  }

  
}

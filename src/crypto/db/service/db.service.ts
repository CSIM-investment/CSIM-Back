import { Injectable } from '@nestjs/common'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, Repository } from 'typeorm'
import { CryptoMarketInput, CryptoMarketOutput } from '../dto/cryptoMarket-create.dto'
import { UpdateCryptoInput } from '../dto/cryptoMarket-update.dto'
import { CryptoSearchInput } from '../dto/cryptoMarket-query'

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

  async updateCryptoCurrencyMarket(
    cryptoMarketId: CryptoCurrencyMarket['id'],
    input: UpdateCryptoInput,
  ): Promise<CryptoCurrencyMarket> {
    //TODO get by object and not id ?
    const cryptoMarket = await this.cryptoRepository.findOneByOrFail(input)
    cryptoMarket.id = input.id
    cryptoMarket.name = input.name
    cryptoMarket.image = input.image
    cryptoMarket.current_price = input.current_price
    cryptoMarket.market_cap = input.market_cap
    cryptoMarket.market_cap_rank = input.market_cap_rank
    cryptoMarket.fully_diluted_valuation = input.fully_diluted_valuation
    cryptoMarket.total_volume = input.total_volume
    cryptoMarket.high_24h = input.high_24h
    cryptoMarket.low_24h = input.low_24h
    cryptoMarket.price_change_24h = input.price_change_24h
    cryptoMarket.price_change_percentage_24h = input.price_change_percentage_24h
    cryptoMarket.market_cap_change_24h = input.market_cap_change_24h
    cryptoMarket.market_cap_change_percentage_24h = input.market_cap_change_percentage_24h
    cryptoMarket.circulating_supply = input.circulating_supply
    cryptoMarket.total_supply = input.total_supply
    cryptoMarket.max_supply = input.max_supply
    cryptoMarket.ath = input.ath
    cryptoMarket.ath_change_percentage = input.ath_change_percentage
    cryptoMarket.ath_date = input.ath_date
    cryptoMarket.atl = input.atl
    cryptoMarket.atl_change_percentage = input.atl_change_percentage
    cryptoMarket.atl_date = input.atl_date
    cryptoMarket.roi = input.roi
    cryptoMarket.last_updated = input.last_updated

    await this.cryptoRepository.save(cryptoMarket)
    return cryptoMarket
  }

  async search(cryptosInput: CryptoSearchInput): Promise<CryptoCurrencyMarket[]> {
    const { orderBy, filterBy } = cryptosInput
    const { symbol, pagination, search } = filterBy

    let query = this.cryptoRepository.createQueryBuilder().select()

    if (symbol) {
      query = query.where(`symbol = :symbol`, { symbol })
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
        //   qb.where(`id LIKE :id`, { id: `%${search.id}%` })
        //     .orWhere(`name LIKE :name`, { name: `%${search.name}%` })
            // .orWhere(`image LIKE :image`, { image: `%${search.image}%` })
            // .orWhere(`current_price LIKE :current_price`, { current_price: `%${search.current_price}%` })
            // .orWhere(`market_cap LIKE :market_cap`, { market_cap: `%${search.market_cap}%` })
            // .orWhere(`market_cap_rank LIKE :market_cap_rank`, { market_cap_rank: `%${search.market_cap_rank}%` })
            // .orWhere(`fully_diluted_valuation LIKE :fully_diluted_valuation`, { fully_diluted_valuation: `%${search.fully_diluted_valuation}%` })
            // .orWhere(`total_volume LIKE :total_volume`, { total_volume: `%${search.total_volume}%` })
            // .orWhere(`high_24h LIKE :high_24h`, { high_24h: `%${search.high_24h}%` })
            // .orWhere(`low_24h LIKE :low_24h`, { low_24h: `%${search.low_24h}%` })
            // .orWhere(`price_change_24h LIKE :price_change_24h`, { price_change_24h: `%${search.price_change_24h}%` })
            // .orWhere(`price_change_percentage_24h LIKE :price_change_percentage_24h`, { price_change_percentage_24h: `%${search.price_change_percentage_24h}%` })
            // .orWhere(`market_cap_change_24h LIKE :market_cap_change_24h`, { market_cap_change_24h: `%${search.market_cap_change_24h}%` })
            // .orWhere(`market_cap_change_percentage_24h LIKE :market_cap_change_percentage_24h`, { market_cap_change_percentage_24h: `%${search.market_cap_change_percentage_24h}%` })
            // .orWhere(`circulating_supply LIKE :circulating_supply`, { circulating_supply: `%${search.circulating_supply}%` })
            // .orWhere(`total_supply LIKE :total_supply`, { total_supply: `%${search.total_supply}%` })
            // .orWhere(`max_supply LIKE :max_supply`, { max_supply: `%${search.max_supply}%` })
            // .orWhere(`ath LIKE :ath`, { ath: `%${search.ath}%` })
            // .orWhere(`ath_change_percentage LIKE :ath_change_percentage`, { ath_change_percentage: `%${search.ath_change_percentage}%` })
            // .orWhere(`ath_date LIKE :ath_date`, { ath_date: `%${search.ath_date}%` })
            // .orWhere(`atl LIKE :atl`, { atl: `%${search.atl}%` })
            // .orWhere(`atl_change_percentage LIKE :atl_change_percentage`, { atl_change_percentage: `%${search.atl_change_percentage}%` })
            // .orWhere(`atl_date LIKE :atl_date`, { atl_date: `%${search.atl_date}%` })
            // .orWhere(`roi LIKE :roi`, { roi: `%${search.roi}%` })
            // .orWhere(`last_updated LIKE :last_updated`, { last_updated: `%${search.last_updated}%` })
        }),
      )
    }

    if (pagination) query = query.limit(pagination.end).offset(pagination.start)
    if (orderBy) query = query.orderBy(orderBy.name, orderBy.direction)

    return await query.getMany()
  }
}

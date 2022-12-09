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
          qb.where(`title LIKE :title`, { title: `%${search.id}%` })
            .orWhere(`description LIKE :description`, { description: `%${search.name}%` })
            .orWhere(`symbol LIKE :symbol`, { symbol: `%${search.image}%` })
            .orWhere(`author LIKE :author`, { author: `%${search.current_price}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.market_cap}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.market_cap_rank}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.fully_diluted_valuation}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.total_volume}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.high_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.low_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.price_change_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.price_change_percentage_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.market_cap_change_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.market_cap_change_percentage_24h}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.circulating_supply}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.total_supply}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.max_supply}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.ath}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.ath_change_percentage}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.ath_date}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.atl}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.atl_change_percentage}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.atl_date}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.roi}%` })
            .orWhere(`source LIKE :source`, { source: `%${search.last_updated}%` })
        }),
      )
    }

    if (pagination) query = query.limit(pagination.end).offset(pagination.start)
    if (orderBy) query = query.orderBy(orderBy.name, orderBy.direction)

    return await query.getMany()
  }
}

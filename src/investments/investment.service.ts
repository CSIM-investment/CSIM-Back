import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { User } from 'src/user/methods/user.methods'
import { Repository } from 'typeorm'
import { CreateInvestmentInput } from './dto/createInvestments.input'
import { InvestmentEntity } from './entities/investment.entity'

@Injectable()
export class InvestmentService {
  constructor(
    @InjectRepository(InvestmentEntity)
    private investmentRepository: Repository<InvestmentEntity>,
    @InjectRepository(CryptoCurrencyMarket)
    private currencyRepository: Repository<CryptoCurrencyMarket>,
  ) { }

  async createInvestment(user: User, input: CreateInvestmentInput): Promise<InvestmentEntity> {
    const { baseCurrencyId, quoteCurrencyId, quantity, valueBaseCurrency, valueQuoteCurrency } = input
    const [baseCurrency, quoteCurrency] = await Promise.all([
      this.currencyRepository.findOneByOrFail({ id: baseCurrencyId }),
      this.currencyRepository.findOneByOrFail({ id: quoteCurrencyId }),
    ])
    const investment = this.investmentRepository.create({
      quoteCurrency,
      baseCurrency,
      user,
      quantity,
      valueBaseCurrency,
      valueQuoteCurrency,
    })
    return await this.investmentRepository.save(investment)
  }
}

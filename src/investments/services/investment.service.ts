import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { User } from 'src/user/methods/user.methods'
import { Repository } from 'typeorm'
import { InvestmentEntity } from '../entities/investment.entity'
import { CreateInvestmentInput } from '../dto/createInvestments.input'

@Injectable()
export class InvestmentService {
    constructor(
        @InjectRepository(InvestmentEntity)
        private investmentRepository: Repository<InvestmentEntity>,
        @InjectRepository(CryptoCurrencyMarket)
        private currencyRepository: Repository<CryptoCurrencyMarket>,
    ) {}

    async createInvestment(
        user: User,
        input: CreateInvestmentInput,
    ): Promise<InvestmentEntity> {
        const {
            baseCurrencySymbol,
            quoteCurrencySymbol,
            quantity,
            valueBaseCurrency,
            valueQuoteCurrency,
            type,
            status,
            origin,
        } = input
        const [baseCurrency, quoteCurrency] = await Promise.all([
            this.currencyRepository.findOneByOrFail({
                symbol: baseCurrencySymbol,
            }),
            this.currencyRepository.findOneByOrFail({
                symbol: quoteCurrencySymbol,
            }),
        ])
        const investment = this.investmentRepository.create({
            status,
            type,
            origin,
            quoteCurrency,
            baseCurrency,
            user,
            quantity,
            valueBaseCurrency,
            valueQuoteCurrency,
        })
        return await this.investmentRepository.save(investment)
    }

    async getInvestementsByUserId(userId: number): Promise<InvestmentEntity[]> {
        return await this.investmentRepository.find({
            where: { user: { id: userId } },
        })
    }

    async soldUser(id: number): Promise<number> {
        let sold = 0
        const investments = await this.getInvestementsByUserId(id)
        investments.forEach((item) => {
            const price = item.quantity * item.valueBaseCurrency
            sold += price
        })
        return sold
    }
}

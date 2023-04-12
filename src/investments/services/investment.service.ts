import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { User } from 'src/user/methods/user.methods'
import { LessThan, Repository } from 'typeorm'
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
            dateOfInvestment,
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
            quoteCurrency,
            baseCurrency,
            user,
            quantity,
            valueBaseCurrency,
            valueQuoteCurrency,
            dateOfInvestment,
        })
        return await this.investmentRepository.save(investment)
    }

    async getInvestementsByUserId(userId: number): Promise<InvestmentEntity[]> {
        return await this.investmentRepository.find({
            where: { user: { id: userId } },
        })
    }

    async getInvestementsByUserIdAndEndDateOfInvestment(
        userId: number,
        endDateOfInvestment: Date,
    ): Promise<InvestmentEntity[]> {
        return await this.investmentRepository.find({
            where: {
                user: {
                    id: userId,
                },
                dateOfInvestment: LessThan(endDateOfInvestment),
            },
        })
    }
}

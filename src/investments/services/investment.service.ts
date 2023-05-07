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
            dateOfInvestment,
        })
        return await this.investmentRepository.save(investment)
    }

    async getInvestementsByUserId(userId: number): Promise<InvestmentEntity[]> {
        const investments: InvestmentEntity[] =
            await this.investmentRepository.find({
                where: { user: { id: userId } },
                relations: ['baseCurrency', 'quoteCurrency'],
            })

        investments.forEach((investment: InvestmentEntity) => {
            investment.valueBaseCurrency =
                investment.valueBaseCurrency * investment.quantity
            investment.valueQuoteCurrency =
                investment.valueQuoteCurrency * investment.quantity
        })

        return investments
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
            order: {
                dateOfInvestment: 'ASC',
            },
        })
    }

    async soldUser(id: number): Promise<number> {
        let sold = 0
        const investments = await this.getInvestementsByUserId(id)
        console.log(investments)
        await investments.forEach((item) => {
            console.log(sold)
            if (item.baseCurrency.id === 'euro') {
                const price = item.valueBaseCurrency
                sold += price
            }
        })
        return sold
    }

    async getMostRecentInvestments(
        userId: number,
    ): Promise<InvestmentEntity[]> {
        const investments = await this.investmentRepository
            .createQueryBuilder('investment')
            .leftJoinAndSelect('investment.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('investment.baseCurrency', 'baseCurrency')
            .where('investment.user.id = :userId', { userId })
            .orderBy('investment.creationDate', 'DESC')
            .take(4)
            .getMany()

        investments.forEach((investment) => {
            investment.valueBaseCurrency *= investment.quantity
            investment.valueQuoteCurrency *= investment.quantity
        })

        return investments
    }

    async getTopInvestments(userId: number): Promise<InvestmentEntity[]> {
        return await this.investmentRepository
            .createQueryBuilder('investment')
            .addSelect(
                `CASE WHEN investment.type = 'eur' THEN investment.quantity * investment.valueBaseCurrency ELSE investment.quantity * investment.valueQuoteCurrency END`,
                'amount',
            )
            .where({ user: { id: userId } })
            .orderBy('amount', 'DESC')
            .leftJoinAndSelect('investment.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('investment.baseCurrency', 'baseCurrency')
            .limit(4)
            .getMany()
    }

    async getLatestBigInvestments(userId: number): Promise<InvestmentEntity[]> {
        return await this.investmentRepository
            .createQueryBuilder('investment')
            .addSelect(
                `CASE WHEN investment.type = 'eur' THEN investment.quantity * investment.valueBaseCurrency ELSE investment.quantity * investment.valueQuoteCurrency END`,
                'amount',
            )
            .where({
                user: {
                    id: userId,
                },
                baseCurrency: {
                    id: 'euro',
                },
            })
            .leftJoinAndSelect('investment.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('investment.baseCurrency', 'baseCurrency')
            .orderBy(
                '(investment.quantity * investment.valueBaseCurrency)',
                'DESC',
            )
            .limit(5)
            .getMany()
    }
}

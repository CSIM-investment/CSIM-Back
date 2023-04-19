import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DbService } from 'src/crypto/db/service/db.service'
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
        private readonly cryptoCurrencyService: DbService,
    ) {}

    async createInvestment(
        user: User,
        input: CreateInvestmentInput,
    ): Promise<InvestmentEntity> {
        const {
            baseCurrencyId,
            quoteCurrencyId,
            quantity,
            valueBaseCurrency,
            valueQuoteCurrency,
        } = input
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

    async getInvestementsByUserId(userId: number): Promise<InvestmentEntity[]> {
        return await this.investmentRepository.find({
            where: { user: { id: userId } },
        })
    }

    async soldUser(id: number): Promise<number> {
        let sold = 0
        const investments = await this.getInvestementsByUserId(id)
        investments.forEach((item) => {
            console.log(item.baseCurrency)
            const price =
                item.quantity *
                item.valueBaseCurrency 
                // * item.baseCurrency.current_price
            sold += price
        })
        return sold
    }

    // async getSpentUser(id: number): Promise<number> {
    //     let spent = 0
    //     const investments =
    //         await this.getInvestementsByUserIdAndValueBaseCurrency(id)

    //     investments
    //         .forEach((item) => {
    //             console.log(item.baseCurrency)
    //             const price =
    //                 item.quantity *
    //                 item.valueBaseCurrency *
    //                 item.baseCurrency.current_price
    //             sold += price
    //         })

    //         .then((datas) => {
    //             datas.forEach((item, index) => {
    //                 let currency_price = 0
    //                 this.cryptoCurrencyService
    //                     .getCurrencyPriceById(item.id)
    //                     .then((data) => {
    //                         currency_price = data
    //                     })
    //                 const price =
    //                     item.quantity * item.valueBaseCurrency * currency_price
    //                 spent += price
    //             })
    //         })
    //     return spent
    // }

    // async getInvestementsByUserIdAndValueBaseCurrency(
    //     userId: number,
    //     baseCurrency: number,
    // ): Promise<InvestmentEntity[]> {
    //     return await this.investmentRepository.find({
    //         where: [
    //             {
    //                 user: {
    //                     id: userId,
    //                 },
    //                 baseCurrency: { id: baseCurrency },
    //             },
    //         ],
    //     })
    // }
}

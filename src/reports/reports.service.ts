import { Injectable } from '@nestjs/common'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import { InvestmentEntity } from '../investments/entities/investment.entity'
import { InvestmentService } from '../investments/services/investment.service'
import { ReportInvestmentsDataInterface } from './interfaces/ReportInvestmentsData.interface'
import { GainOrLooseByCryptoInterfaceInterface } from './interfaces/GainByCryptoInterface.interface'
import { CryptoCount } from './interfaces/CryptoCount'

@Injectable()
export class ReportService {
    constructor(private readonly investmentService: InvestmentService) {}

    async isInvestmentSell(investment: InvestmentEntity): Promise<boolean> {
        return investment.quoteCurrency.symbol == 'eur'
    }

    async isInvestmentBuy(investment: InvestmentEntity): Promise<boolean> {
        return investment.baseCurrency.symbol == 'eur'
    }

    async getCryptosBuyAndSellSortedByCryptoSymbol(
        investmentsList: InvestmentEntity[],
    ): Promise<object> {
        /**
         * {
         *     "sol": [{
         *         investment: Investment,
         *         amountSelled: 2
         *     }]
         * }
         */
        const cryptoBuy = {}
        const cryptoSelled = {}

        investmentsList.forEach((investment) => {
            if (this.isInvestmentBuy(investment)) {
                if (
                    !cryptoBuy.hasOwnProperty(investment.quoteCurrency.symbol)
                ) {
                    cryptoBuy[investment.quoteCurrency.symbol] = []
                }
                cryptoBuy[investment.quoteCurrency.symbol].append(investment)
            } else if (this.isInvestmentSell(investment)) {
                if (!cryptoBuy.hasOwnProperty(investment.baseCurrency.symbol)) {
                    cryptoBuy[investment.baseCurrency.symbol] = []
                }
                cryptoSelled[investment.baseCurrency.symbol].append(investment)
            }
        })
        return { cryptoBuy, cryptoSelled }
    }

    private async countAllCryptoBuyOrSellBySymbol(cryptoBuyOfSymbol: InvestmentEntity[]) {
        let numberOfCryptoOfSymbol = 0.0
        await cryptoBuyOfSymbol.forEach((investmentEntity: InvestmentEntity) => {
            numberOfCryptoOfSymbol += investmentEntity.valueQuoteCurrency * investmentEntity.quantity
        })
        return numberOfCryptoOfSymbol
    }

    private async calculCost(investmentEntity: InvestmentEntity): Promise<{ [key: string]: number }>{
        let costToReturn = {}
        costToReturn[investmentEntity.quoteCurrency.symbol] = investmentEntity.valueQuoteCurrency * investmentEntity.quantity
        costToReturn[investmentEntity.baseCurrency.symbol] = investmentEntity.valueBaseCurrency * investmentEntity.quantity
        return costToReturn
    }

    private async substractCryptoSelledUsingCryptoBuyBeforeDate(cryptoBuy: InvestmentEntity[], cryptoSelled: InvestmentEntity[], date){
        cryptoSelled.forEach((selledInvestmentEntity: InvestmentEntity) => {
            let costOfInvestmentSelled = this.calculCost(selledInvestmentEntity)
            while (costOfInvestmentSelled[selledInvestmentEntity.quoteCurrency.symbol] !== 0 && cryptoBuy.length > 0) {
                // soustraire le buyed crypto
            }
        })
    }

    private async separateInvestmentBuyAndSelledToGenerateReport(
        investments: InvestmentEntity[],
        cryptoBuy: {[key: string]: InvestmentEntity[]},
        cryptoSelled: {[key: string]: InvestmentEntity[]},
        beginDate: Date,
        endDate: Date,
    ): Promise<ReportInvestmentsDataInterface> {
        const gainsByCrypto: GainOrLooseByCryptoInterfaceInterface[] = []
        const loosesByCrypto: GainOrLooseByCryptoInterfaceInterface[] = []
        const investmentsOfMonth: InvestmentEntity[] = []
        const numberOfCryptoOnEndDate: CryptoCount[] = []
        const numberOfCryptoOnStartDate: CryptoCount[] = []
        let loosesOfMonth = 0,
            gainsOfMonth = 0

        for (const symbol in cryptoSelled) {
            const cryptoSelledOfSymbol = cryptoSelled[symbol]
            const cryptoBuyOfSymbol = cryptoBuy[symbol]

            // Count all crypto
            const countAllCryptoBuyed = this.countAllCryptoBuyOrSellBySymbol(cryptoBuyOfSymbol)
            const countAllCryptoSelled = this.countAllCryptoBuyOrSellBySymbol(cryptoSelledOfSymbol)

            // Substract cryptoSelledOfSymbol by cryptoBuyOfSymbol
            this.substractCryptoSelledUsingCryptoBuyBeforeDate(cryptoBuyOfSymbol, cryptoSelledOfSymbol, beginDate)


            numberOfCryptoOnStartDate =

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (crypto.baseCurrency.symbol === symbol) {
                if (cryptoBuy.includes(crypto.baseCurrency.symbol)) {
                    while (crypto.valueBaseCurrency * crypto.quantity !== 0) {
                        cryptoBuyUsingThisSymbol.forEach(
                            (cryptoBuyEntity: InvestmentEntity) => {
                                if (crypto.dateOfInvestment < endDate)
                                    if (
                                        cryptoBuyEntity.valueBaseCurrency *
                                        cryptoBuyEntity.quantity <
                                        crypto.valueQuoteCurrency *
                                        crypto.quantity
                                    ) {
                                    } else if (
                                        cryptoBuyEntity.valueBaseCurrency *
                                        cryptoBuyEntity.quantity ==
                                        crypto.valueBaseCurrency *
                                        crypto.quantity
                                    ) {
                                    } else {
                                    }
                            },
                        )
                    }
                }
            }
        }

        return {
            investments: investmentsOfMonth,
            numberOfCryptoOnEndDate: numberOfCryptoOnEndDate,
            numberOfCryptoOnBeginDate: numberOfCryptoOnStartDate,
            gainByCrypto: gainsByCrypto,
            looseByCrypto: loosesByCrypto,
            gainOfMonth: gainsOfMonth,
            looseOfMonth: loosesOfMonth,
            startDate: beginDate,
            endDate: endDate,
        }
    }

    async generateReportDataUsingInvestmentsList(
        investmentsList: InvestmentEntity[],
        start_date: Date,
        end_date: Date,
    ): Promise<ReportInvestmentsDataInterface> {
        let gains = 0
        let loose = 0
        let investmentsBetweenDates = []
        let cryptoOnBeginDate = []
        let cryptoOnEndDate = []

        // Get crypto

        /**
         * {
         *     "sol": [{
         *         investment: Investment,
         *         amountSelled: 2
         *     }]
         * }
         */

        let { cryptoBuy, cryptoSelled } =
            await this.getCryptosBuyAndSellSortedByCryptoSymbol(investmentsList)

        this.separateInvestmentBuyAndSelledToGenerateReport(
            cryptoBuy,
            cryptoSelled,
            start_date,
            end_date,
        )

        return {
            startDate: start_date,
            endDate: end_date,
            gainOfMonth: gains,
            looseOfMonth: loose,
            investments: investmentsBetweenDates,
            numberOfCryptoOnBeginDate: cryptoOnBeginDate,
            numberOfCryptoOnEndDate: cryptoOnEndDate,
            gainByCrypto: [],
            looseByCrypto: [],
        }
    }

    async generateInvestmentReports(options, user): Promise<Buffer> {
        console.log(options.toDate)
        let investmentService =
            await this.investmentService.getInvestementsByUserIdAndEndDateOfInvestment(
                user ? user.id : null,
                new Date(options.toDate),
            )

        await this.generateReportDataUsingInvestmentsList(
            investmentService,
            options.fromDate,
            options.toDate,
        )

        console.log(investmentService)

        const invest1 = new InvestmentEntity()
        const investmentReport = new InvestmentReportDocument({
            investments: ['Investment 1', 'Investment 2', 'Investment 3'],
            gains: [
                '1 SOL - 23/03/2023 - 20 EUR -> 1 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
            startDate: options.fromDate,
            endDate: options.toDate,
            sales: [
                '5 SOL - 23/03/2023 - 20 EUR -> 5 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
        })
        investmentReport.generate_investment_report_using_investments()
        return await investmentReport.to_pdf()
    }

    async soldUser(userId: number): Promise<number> {
        let sold = 0
        const investments = []
        investments.forEach((item) => {
            const price =
                item.quantity *
                item.valueBaseCurrency *
                item.baseCurrency.current_price
            sold += price
        })
        return Number(sold)
    }
}

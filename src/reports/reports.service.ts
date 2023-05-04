import { Injectable } from '@nestjs/common'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import { InvestmentEntity } from '../investments/entities/investment.entity'
import { InvestmentService } from '../investments/services/investment.service'
import { ReportInvestmentsDataInterface } from './interfaces/ReportInvestmentsData.interface'
import { GainOrLooseByCryptoInterface } from './interfaces/GainByCryptoInterface.interface'
import { CryptoCount } from './interfaces/CryptoCount'
import { Repository } from 'typeorm'
import { CryptoCurrencyMarket } from '../crypto/entities/cryptocurrency.entity'
import { FirebaseService } from './firebase/firebaseService'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { UserEntity } from '../user/entities/user.entity'
import * as fs from 'fs'

@Injectable()
export class ReportService {
    constructor(
        private readonly investmentService: InvestmentService,
        @InjectRepository(InvestmentEntity)
        private investmentRepository: Repository<InvestmentEntity>,
        @InjectRepository(InvestmentsReportsEntity)
        private investmentReportRepository: Repository<InvestmentsReportsEntity>,
        private readonly firebaseService: FirebaseService,
    ) {}

    async search(
        reportsInput: InvestmentsReportsInput,
        user: UserEntity,
    ): Promise<InvestmentsReportsEntity[]> {
        const { orderBy, filterBy } = reportsInput
        const { pagination, search } = filterBy
        const userId = user.id
        const searchKeys = ['mensualReport']

        console.log(user.id)

        let query = this.investmentReportRepository
            .createQueryBuilder()
            .select()
            .leftJoinAndSelect('InvestmentsReportsEntity.user', 'UserEntity')
            .where('"InvestmentsReportsEntity"."userId" = :userId', { userId })

        if (pagination)
            query = query.limit(pagination.end).offset(pagination.start)

        if (orderBy) query = query.orderBy(orderBy.name, orderBy.direction)

        return await query.getMany()
    }

    async isInvestmentSell(investment: InvestmentEntity): Promise<boolean> {
        return ['eur', 'euro'].includes(investment.quoteCurrency.symbol)
    }

    async isInvestmentBuy(investment: InvestmentEntity): Promise<boolean> {
        return ['eur', 'euro'].includes(investment.baseCurrency.symbol)
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

        for (const investment of investmentsList) {
            if (await this.isInvestmentBuy(investment)) {
                if (
                    !cryptoBuy.hasOwnProperty(investment.quoteCurrency.symbol)
                ) {
                    cryptoBuy[investment.quoteCurrency.symbol] = []
                }
                cryptoBuy[investment.quoteCurrency.symbol].push(investment)
            } else if (await this.isInvestmentSell(investment)) {
                if (
                    !cryptoSelled.hasOwnProperty(investment.baseCurrency.symbol)
                ) {
                    cryptoSelled[investment.baseCurrency.symbol] = []
                }
                cryptoSelled[investment.baseCurrency.symbol].push(investment)
            }
        }
        return { cryptoBuy, cryptoSelled }
    }

    private async countAllCryptoBuyOrSellBySymbol(
        cryptoBuyOfSymbol: InvestmentEntity[],
    ): Promise<number> {
        let numberOfCryptoOfSymbol = 0.0
        await cryptoBuyOfSymbol.forEach(
            (investmentEntity: InvestmentEntity) => {
                numberOfCryptoOfSymbol +=
                    investmentEntity.valueQuoteCurrency *
                    investmentEntity.quantity
            },
        )
        return numberOfCryptoOfSymbol
    }

    private calculCost(
        investmentEntity: InvestmentEntity,
        percentage = 1,
    ): { [key: string]: number } {
        const costToReturn = {}
        costToReturn[investmentEntity.quoteCurrency.symbol] =
            investmentEntity.valueQuoteCurrency *
            (investmentEntity.quantity * percentage)
        costToReturn[investmentEntity.baseCurrency.symbol] =
            investmentEntity.valueBaseCurrency *
            (investmentEntity.quantity * percentage)
        return costToReturn
    }

    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj))
    }

    private async substractCryptoSelledUsingCryptoBuyBeforeDate(
        cryptoBuy: InvestmentEntity[],
        cryptoSelled: InvestmentEntity[],
        date: Date,
    ): Promise<GainOrLooseByCryptoInterface[]> {
        const detailedGainOrLoose: GainOrLooseByCryptoInterface[] = []
        const cryptoCurrencyMarket: CryptoCurrencyMarket =
            cryptoSelled.length > 0 ? cryptoSelled[0].baseCurrency : null

        cryptoSelled.forEach((selledInvestmentEntity: InvestmentEntity) => {
            const costOfInvestmentSelled: { [key: string]: number } =
                this.calculCost(selledInvestmentEntity)
            const investmentsBuyedForThisSell: InvestmentEntity[] = []
            cryptoBuy.forEach((buyInvestmentEntity: InvestmentEntity) => {
                if (buyInvestmentEntity.dateOfInvestment < date) {
                    const costOfInvestmentBuyed =
                        this.calculCost(buyInvestmentEntity)
                    if (
                        costOfInvestmentBuyed[
                            buyInvestmentEntity.quoteCurrency.symbol
                        ] >=
                        costOfInvestmentSelled[
                            buyInvestmentEntity.baseCurrency.symbol
                        ]
                    ) {
                        costOfInvestmentSelled[
                            buyInvestmentEntity.quoteCurrency.symbol
                        ] -=
                            costOfInvestmentBuyed[
                                buyInvestmentEntity.quoteCurrency.symbol
                            ]
                        costOfInvestmentSelled[
                            buyInvestmentEntity.baseCurrency.symbol
                        ] -=
                            costOfInvestmentBuyed[
                                buyInvestmentEntity.baseCurrency.symbol
                            ]
                        investmentsBuyedForThisSell.push(
                            this.deepCopy(buyInvestmentEntity),
                        )
                        buyInvestmentEntity.quantity = 0
                    } else if (
                        costOfInvestmentSelled[
                            buyInvestmentEntity.baseCurrency.symbol
                        ] != 0
                    ) {
                        // get difference
                        const differenceBetweenCryptoValue =
                            costOfInvestmentSelled[
                                buyInvestmentEntity.baseCurrency.symbol
                            ] -
                            costOfInvestmentBuyed[
                                buyInvestmentEntity.quoteCurrency.symbol
                            ]
                        const percentageOfCryptoBuy =
                            differenceBetweenCryptoValue /
                            costOfInvestmentBuyed[
                                buyInvestmentEntity.quoteCurrency.symbol
                            ]
                        const costOfInvestmentBuyedToSubstract =
                            this.calculCost(
                                buyInvestmentEntity,
                                percentageOfCryptoBuy,
                            )
                        costOfInvestmentSelled[
                            buyInvestmentEntity.baseCurrency.symbol
                        ] -=
                            costOfInvestmentBuyedToSubstract[
                                buyInvestmentEntity.baseCurrency.symbol
                            ]
                        costOfInvestmentSelled[
                            buyInvestmentEntity.quoteCurrency.symbol
                        ] -=
                            costOfInvestmentBuyedToSubstract[
                                buyInvestmentEntity.quoteCurrency.symbol
                            ]
                        const investmentToAddToSell = this.deepCopy(buyInvestmentEntity)
                        investmentToAddToSell.quantity = costOfInvestmentBuyedToSubstract[buyInvestmentEntity.quoteCurrency.symbol]
                        buyInvestmentEntity.quantity -= investmentToAddToSell.quantity
                        investmentsBuyedForThisSell.push(
                            investmentToAddToSell,
                        )
                    }
                }
            })
            detailedGainOrLoose.push({
                crypto: cryptoCurrencyMarket,
                investmentEntityBuy: investmentsBuyedForThisSell,
                type: 'idk',
                gains: costOfInvestmentSelled[
                    selledInvestmentEntity.quoteCurrency.symbol
                ],
                looses: -costOfInvestmentSelled[
                    selledInvestmentEntity.quoteCurrency.symbol
                ],
                investmentEntitySell: selledInvestmentEntity,
            })
        })
        return detailedGainOrLoose
    }

    private async generateGainOrLooseOfCrypto(
        gainOrLooseOfCrypto: GainOrLooseByCryptoInterface[],
    ): Promise<GainOrLooseByCryptoInterface> {
        if (gainOrLooseOfCrypto.length > 0) {
            let gains = 0.0
            let looses = 0.0
            const investmentsBuy: InvestmentEntity[] = []
            const investmentSelled: InvestmentEntity[] = []
            gainOrLooseOfCrypto.forEach((value) => {
                gains += value.gains
                looses += value.looses
                investmentsBuy.concat(value.investmentEntityBuy)
                investmentSelled.concat(value.investmentEntitySell)
            })
            return {
                crypto: gainOrLooseOfCrypto[0].crypto,
                gains: gains,
                looses: looses,
                gainOrLooseByCrypto: gainOrLooseOfCrypto,
                type: 'investment selled',
                investmentEntityBuy: investmentsBuy,
                investmentEntitySell: investmentSelled,
            }
        } else {
            return null
        }
    }

    private async separateInvestmentBuyAndSelledToGenerateReport(
        cryptoBuy: { [key: string]: InvestmentEntity[] },
        cryptoSelled: { [key: string]: InvestmentEntity[] },
        beginDate: Date,
        endDate: Date,
    ): Promise<ReportInvestmentsDataInterface> {
        const gainOrLooseByCryptoList: GainOrLooseByCryptoInterface[] = []
        const investmentsOfMonth: InvestmentEntity[] = []
        const numberOfCryptoOnEndDate: CryptoCount[] = []
        const numberOfCryptoOnStartDate: CryptoCount[] = []
        const loosesOfMonth = 0,
            gainsOfMonth = 0

        for (const symbol in cryptoSelled) {
            const cryptoSelledOfSymbol = cryptoSelled[symbol]
            const cryptoBuyOfSymbol = cryptoBuy[symbol]

            // Count all crypto
            const countAllCryptoBuyed =
                await this.countAllCryptoBuyOrSellBySymbol(cryptoBuyOfSymbol)
            const countAllCryptoSelled =
                await this.countAllCryptoBuyOrSellBySymbol(cryptoSelledOfSymbol)

            // Substract cryptoSelledOfSymbol by cryptoBuyOfSymbol
            const gainOrLooseOfCrypto: GainOrLooseByCryptoInterface[] =
                await this.substractCryptoSelledUsingCryptoBuyBeforeDate(
                    cryptoBuyOfSymbol,
                    cryptoSelledOfSymbol,
                    endDate,
                )

            gainOrLooseByCryptoList.push(
                await this.generateGainOrLooseOfCrypto(gainOrLooseOfCrypto),
            )
        }

        return {
            investments: investmentsOfMonth,
            numberOfCryptoOnEndDate: numberOfCryptoOnEndDate,
            numberOfCryptoOnBeginDate: numberOfCryptoOnStartDate,
            gainOrLooseByCrypto: gainOrLooseByCryptoList,
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
        const gains = 0
        const loose = 0
        const investmentsBetweenDates = []
        const cryptoOnBeginDate = []
        const cryptoOnEndDate = []

        // Get crypto

        /**
         * {
         *     "sol": [{
         *         investment: Investment,
         *         amountSelled: 2
         *     }]
         * }
         */

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { cryptoBuy, cryptoSelled } =
            await this.getCryptosBuyAndSellSortedByCryptoSymbol(investmentsList)

        const gainOrLooseByCrypto: ReportInvestmentsDataInterface =
            await this.separateInvestmentBuyAndSelledToGenerateReport(
                cryptoBuy,
                cryptoSelled,
                start_date,
                end_date,
            )

        return {
            startDate: start_date,
            endDate: end_date,
            gainOfMonth: gainOrLooseByCrypto.gainOfMonth,
            looseOfMonth: gainOrLooseByCrypto.looseOfMonth,
            investments: investmentsBetweenDates,
            numberOfCryptoOnBeginDate: cryptoOnBeginDate,
            numberOfCryptoOnEndDate: cryptoOnEndDate,
            gainOrLooseByCrypto: gainOrLooseByCrypto.gainOrLooseByCrypto,
        }
    }

    async generateInvestmentReports(
        options,
        user,
    ): Promise<InvestmentsReportsEntity> {
        const investmentService =
            await this.investmentService.getInvestementsByUserIdAndEndDateOfInvestment(
                user ? user.id : null,
                new Date(options.toDate),
            )

        const reportInvestmentData =
            await this.generateReportDataUsingInvestmentsList(
                investmentService,
                options.fromDate,
                options.toDate,
            )

        const investmentReport = new InvestmentReportDocument(
            reportInvestmentData,
        )
        investmentReport.generate_investment_report_using_investments()
        const pdfFileBuffer = await investmentReport.to_pdf()

        const path = await this.firebaseService.uploadPdf(
            pdfFileBuffer,
            investmentReport.title,
        )
        const generatedInvestmentReport: InvestmentsReportsEntity =
            this.investmentReportRepository.create({
                mensualReport: false,
                reportUri: path,
                user: user,
                toDate: options.toDate,
                fromDate: options.fromDate,
            })
        return this.investmentReportRepository.save(generatedInvestmentReport)
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

import { Injectable } from '@nestjs/common'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import { InvestmentEntity } from '../investments/entities/investment.entity'
import { InvestmentService } from '../investments/services/investment.service'
import { ReportInvestmentsDataInterface } from './interfaces/ReportInvestmentsData.interface'
import { GainOrLooseByCryptoInterfaceInterface } from './interfaces/GainByCryptoInterface.interface'
import { CryptoCount } from './interfaces/CryptoCount'
import { Repository } from 'typeorm'
import { CryptoCurrencyMarket } from '../crypto/entities/cryptocurrency.entity'
import { FirebaseService } from './firebase/firebaseService'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ReportService {
    constructor(
        private readonly investmentService: InvestmentService,
        private investmentRepository: Repository<InvestmentEntity>,
        @InjectRepository(InvestmentsReportsEntity)
        private investmentReportRepository: Repository<InvestmentsReportsEntity>,
        private readonly firebaseService: FirebaseService,
    ) {}

    async isInvestmentSell(investment: InvestmentEntity): Promise<boolean> {
        console.log(investment.quoteCurrency)
        return investment.quoteCurrency.symbol == 'eur'
    }

    async isInvestmentBuy(investment: InvestmentEntity): Promise<boolean> {
        console.log(investment)
        return investment.baseCurrency.symbol == 'eur'
    }

    getCryptosBuyAndSellSortedByCryptoSymbol(
        investmentsList: InvestmentEntity[],
    ): object {
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
                cryptoBuy[investment.quoteCurrency.symbol].push(investment)
            } else if (this.isInvestmentSell(investment)) {
                if (!cryptoBuy.hasOwnProperty(investment.baseCurrency.symbol)) {
                    cryptoBuy[investment.baseCurrency.symbol] = []
                }
                cryptoSelled[investment.baseCurrency.symbol].push(investment)
            }
        })
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

    private async substractCryptoSelledUsingCryptoBuyBeforeDate(
        cryptoBuy: InvestmentEntity[],
        cryptoSelled: InvestmentEntity[],
        date: Date,
    ): Promise<GainOrLooseByCryptoInterfaceInterface[]> {
        const detailedGainOrLoose: GainOrLooseByCryptoInterfaceInterface[] = []
        const cryptoCurrencyMarket: CryptoCurrencyMarket =
            cryptoSelled.length > 0 ? cryptoSelled[0].quoteCurrency : null

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
                        investmentsBuyedForThisSell.push(buyInvestmentEntity)
                        buyInvestmentEntity.quantity = 0
                    } else if (
                        costOfInvestmentSelled[
                            buyInvestmentEntity.baseCurrency.symbol
                        ] == 0
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
                        buyInvestmentEntity.quantity -= parseFloat(
                            String(costOfInvestmentBuyedToSubstract),
                        )
                        const investmentToAddToSell: InvestmentEntity =
                            this.investmentRepository.create(
                                buyInvestmentEntity,
                            )
                        investmentToAddToSell.quantity =
                            costOfInvestmentBuyedToSubstract[
                                buyInvestmentEntity.quoteCurrency.symbol
                            ]
                        investmentsBuyedForThisSell.push(investmentToAddToSell)
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
        gainOrLooseOfCrypto: GainOrLooseByCryptoInterfaceInterface[],
    ): Promise<GainOrLooseByCryptoInterfaceInterface> {
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
        const gainOrLooseByCryptoList: GainOrLooseByCryptoInterfaceInterface[] =
            []
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
                this.countAllCryptoBuyOrSellBySymbol(cryptoBuyOfSymbol)
            const countAllCryptoSelled =
                this.countAllCryptoBuyOrSellBySymbol(cryptoSelledOfSymbol)

            // Substract cryptoSelledOfSymbol by cryptoBuyOfSymbol
            const gainOrLooseOfCrypto: GainOrLooseByCryptoInterfaceInterface[] =
                await this.substractCryptoSelledUsingCryptoBuyBeforeDate(
                    cryptoBuyOfSymbol,
                    cryptoSelledOfSymbol,
                    beginDate,
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
            this.getCryptosBuyAndSellSortedByCryptoSymbol(investmentsList)

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
        console.log(options.toDate)
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

        console.log(investmentService)

        const investmentReport = new InvestmentReportDocument(
            reportInvestmentData,
        )
        investmentReport.generate_investment_report_using_investments()
        const pdfFile = await investmentReport.to_pdf()
        const path = await this.firebaseService.uploadPdf(
            pdfFile,
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

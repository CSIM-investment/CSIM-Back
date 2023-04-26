import { InvestmentEntity } from '../../investments/entities/investment.entity'
import { GainOrLooseByCryptoInterface } from './GainByCryptoInterface.interface'
import { CryptoCount } from './CryptoCount'

export interface ReportInvestmentsDataInterface {
    numberOfCryptoOnBeginDate: CryptoCount[]
    numberOfCryptoOnEndDate: CryptoCount[]

    gainOfMonth: number
    looseOfMonth: number
    gainOrLooseByCrypto: GainOrLooseByCryptoInterface[]

    startDate: Date
    endDate: Date
    investments: InvestmentEntity[]
}

import { InvestmentEntity } from '../../investments/entities/investment.entity'
import { GainOrLooseByCryptoInterfaceInterface } from './GainByCryptoInterface.interface'
import { CryptoCount } from './CryptoCount'

export interface ReportInvestmentsDataInterface {
    numberOfCryptoOnBeginDate: CryptoCount[]
    numberOfCryptoOnEndDate: CryptoCount[]

    gainOfMonth: number
    looseOfMonth: number
    gainOrLooseByCrypto: GainOrLooseByCryptoInterfaceInterface[]

    startDate: Date
    endDate: Date
    investments: InvestmentEntity[]
}

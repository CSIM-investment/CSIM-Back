import { CryptoCurrencyMarket } from '../../crypto/entities/cryptocurrency.entity'
import { InvestmentEntity } from '../../investments/entities/investment.entity'

export interface GainOrLooseByCryptoInterfaceInterface {
    crypto: CryptoCurrencyMarket
    gains?: number
    looses?: number
    investmentEntityBuy: InvestmentEntity[]
    investmentEntitySell: InvestmentEntity
    type: string
}

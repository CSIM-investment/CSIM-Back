import { CryptoCurrencyMarket } from '../../crypto/entities/cryptocurrency.entity'
import { InvestmentEntity } from '../../investments/entities/investment.entity'

export interface GainOrLooseByCryptoInterface {
    crypto: CryptoCurrencyMarket
    gains?: number
    looses?: number
    investmentEntityBuy: InvestmentEntity[]
    investmentEntitySell: InvestmentEntity | InvestmentEntity[]
    type: string
    gainOrLooseByCrypto?: GainOrLooseByCryptoInterface[]
}

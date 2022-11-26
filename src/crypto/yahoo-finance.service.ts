import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'
import * as yahooFinance from 'yahoo-finance'

@Injectable()
export class YahooFinanceService {
  private readonly yahooFinanceCurrencyName: string

  constructor(
    private stockOrCryptoName: string,
    private currency: string = 'EUR',
  ) {
    this.yahooFinanceCurrencyName = stockOrCryptoName + '-' + currency
  }

  async checkCurrency() {
    if (!['USD', 'EUR'].includes(this.currency)) {
      throw Error('Currency must be USD or EUR !')
    }
  }

  async getHistory(beginDate?: dayjs.Dayjs, endDate?: dayjs.Dayjs) {
    await this.checkCurrency()

    if (beginDate === undefined && endDate === undefined) {
      endDate = dayjs()
    }

    if (beginDate === undefined) {
      beginDate = endDate
      beginDate = endDate.subtract(1, 'day')
    }

    if (endDate === undefined) {
      beginDate = endDate.add(1, 'day')
    }

    const beginDateString = dayjs(beginDate).format('YYYY-MM-DD')
    const endDateString = dayjs(beginDate).format('YYYY-MM-DD')

    return await yahooFinance.historical(
      {
        symbol: this.yahooFinanceCurrencyName,
        from: beginDateString,
        to: endDateString,
      },
      async function (err, quotes) {
        if (err) throw Error(err)

        return quotes
      },
    )
  }
}

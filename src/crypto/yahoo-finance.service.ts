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

  async getHistory(from?: dayjs.Dayjs, to?: dayjs.Dayjs) {
    await this.checkCurrency()

    if (from === undefined && to === undefined) {
      to = dayjs()
    }

    if (from === undefined) {
      from = to
      from = to.subtract(1, 'day')
    }

    if (to === undefined) {
      to = from.add(1, 'day')
    }

    const beginDateString = dayjs(from).format('YYYY-MM-DD')
    const endDateString = dayjs(to).format('YYYY-MM-DD')

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

import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'
import * as yahooFinance from 'yahoo-finance'

@Injectable()
export class YahooFinanceService {
  private readonly currencyName: string

  constructor(private stockOrCryptoName?: string, private currency: string = 'EUR') {
    this.currencyName = `${this.stockOrCryptoName}-${this.currency}`
  }

  async checkCurrency(): Promise<void> {
    if (!['USD', 'EUR'].includes(this.currency)) throw Error('Currency must be USD or EUR !')
  }

  private buildFromAndToForHistory(beginDate?: Date, endDate?: Date): { from: string; to: string } {

    const endDateDayjs = dayjs(endDate ?? new Date())
    let beginDateDayjs = null
    if(beginDate)
      beginDateDayjs = dayjs(beginDate)
    else
      beginDateDayjs = endDateDayjs.subtract(1, 'day')
    

    const from = dayjs(beginDateDayjs).format('YYYY-MM-DD')
    const to = dayjs(endDateDayjs).format('YYYY-MM-DD')

    return { from, to }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getHistory(beginDate?: Date, endDate?: Date): Promise<any> {
    await this.checkCurrency()
    const { from, to } = this.buildFromAndToForHistory(beginDate, endDate)

    return await yahooFinance.historical(
      {
        symbol: this.currencyName,
        from,
        to,
        period:"d"
      },
      async function (err: string, quotes) {
        if (err) throw new Error(err)
        return quotes
      },
    )
  }
}

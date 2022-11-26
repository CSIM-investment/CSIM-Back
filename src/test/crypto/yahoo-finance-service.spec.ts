import { Test, TestingModule } from '@nestjs/testing'
import { YahooFinanceService } from '../../crypto/yahoo-finance.service'
import * as dayjs from 'dayjs'

describe('YahooFinanceServiceController', () => {
  let service: YahooFinanceService

  it('getHistoricalOfBTCWithoutParameterInFunctionWork', async () => {
    const data = await new YahooFinanceService('BTC').getHistory()
    expect(data.length > 0).toBeTruthy()
  })

  it('getHistoricalOfBTCWithOnlyBeginDateParameterInFunctionWork', async () => {
    const beginDate = dayjs('2022-02-22', 'YYYY-MM-JJ')
    const data = await new YahooFinanceService('BTC').getHistory(beginDate)
    expect(data.length > 0).toBeTruthy()
  })

  it('getHistoricalOfBTCWithOnlyEndDateParameterInFunctionWork', async () => {
    const data = await new YahooFinanceService('BTC').getHistory(
      undefined,
      dayjs('2022-02-22', 'YYYY-MM-JJ'),
    )
    expect(data.length > 0).toBeTruthy()
  })

  it('getHistoricalOfBTCWithAllParameterInFunctionWork', async () => {
    const beginDate = dayjs('2022-02-22', 'YYYY-MM-JJ')
    const endDate = dayjs('2022-11-26', 'YYYY-MM-JJ')
    const data = await new YahooFinanceService('BTC').getHistory(
      beginDate,
      endDate,
    )
    expect(data.length > 0).toBeTruthy()
  })
})

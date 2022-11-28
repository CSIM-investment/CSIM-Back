import { Test, TestingModule } from '@nestjs/testing'
import { YahooFinanceService } from '../../crypto/yahoo-finance.service'
import * as dayjs from 'dayjs'

describe('Yahoo Finance Service Controller', () => {
  let service: YahooFinanceService

  it('get historical of BTC without parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory()
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with only begin date parameter in function work', async () => {
    const beginDate = dayjs('2022-02-22', 'YYYY-MM-JJ')
    const data = await new YahooFinanceService('BTC').getHistory(beginDate)
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with only end date parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory(
      undefined,
      dayjs('2022-02-22', 'YYYY-MM-JJ'),
    )
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with all parameter in function work', async () => {
    const beginDate = dayjs('2022-02-22', 'YYYY-MM-JJ')
    const endDate = dayjs('2022-11-26', 'YYYY-MM-JJ')
    const data = await new YahooFinanceService('BTC').getHistory(
      beginDate,
      endDate,
    )
    expect(data.length > 0).toBeTruthy()
  })
})

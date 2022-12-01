import { YahooFinanceService } from '../../crypto/yahoo-finance.service'

describe('Yahoo Finance Service Controller', () => {
  let beginDate: Date
  let endDate: Date

  beforeEach(() => {
    beginDate = new Date()
    endDate = new Date('2022-11-26')
  })

  it('get historical of BTC without parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory()
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with only begin date parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory(beginDate)
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with only end date parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory(undefined, endDate)
    expect(data.length > 0).toBeTruthy()
  })

  it('get historical of BTC with all parameter in function work', async () => {
    const data = await new YahooFinanceService('BTC').getHistory(beginDate, endDate)
    expect(data.length > 0).toBeTruthy()
  })
})

import { Test, TestingModule } from '@nestjs/testing'
import { YahooFinanceService } from '../../crypto/yahoo-finance.service'

describe('YahooFinanceServiceController', () => {
  let service: YahooFinanceService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YahooFinanceService,
      ],
    }).compile()
    service = await module.get(YahooFinanceService)
  })

  it('getHistoricalOfBTCWithoutParametterInFunctionWork', async () => {
    const data = await new YahooFinanceService('BTC').getHistory()
    console.log(data)
  })
})

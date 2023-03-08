import { Controller, Get, Param } from '@nestjs/common'
import { CoingeckoService } from './service/coingecko.service'

@Controller('coingecko')
export class CoingeckoController {
    constructor(private readonly coinGeckoService: CoingeckoService) { }

    @Get('/coins/markets')
    getAllCoinsMarket() {
        this.coinGeckoService.getAllCoinsMarket()
    }

    @Get('/exchanges')
    getCompleteExchanges() {
        this.coinGeckoService.getCompleteExchanges().subscribe((resp) => { })
    }

    @Get('/exchanges/list')
    getExchangesList() {
        this.coinGeckoService.getExchangesList().subscribe((resp) => { })
    }

    @Get('/coins/:id/tickers')
    getExchangeById(@Param() param) {
        this.coinGeckoService.getExchangeById(param.id).subscribe((resp) => { })
    }

    @Get('/exchanges/list')
    getGlobalCryptocurrency() {
        this.coinGeckoService.getGlobalCryptocurrency().subscribe((resp) => { })
    }
}

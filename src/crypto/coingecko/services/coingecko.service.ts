import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'

@Injectable()
export class CoingeckoService {
    constructor(
        private readonly httpService: HttpService,
        private readonly apiUrl: string = process.env.COINGECKO_API,
    ) {}

    async getAllCoinsMarket(): Promise<CryptoCurrencyMarket[]> {
        const url = `${this.apiUrl}/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        const { data } = await firstValueFrom(this.httpService.get(url))
        return data
    }
}

import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'

@Injectable()
export class CoingeckoService {
    constructor(private readonly httpService: HttpService) {}
    private readonly apiUrl: string = process.env.COINGECKO_API

    async getAllCoinsMarket(): Promise<CryptoCurrencyMarket[]> {
        const { data } = await firstValueFrom(this.httpService.get(this.apiUrl))
        return data
    }
}

import { Module } from '@nestjs/common'
import { CoingeckoService } from './services/coingecko.service'
import { HttpService } from '@nestjs/axios'

@Module({
    imports: [HttpService],
    providers: [CoingeckoService],
})
export class CoingeckoModule { }

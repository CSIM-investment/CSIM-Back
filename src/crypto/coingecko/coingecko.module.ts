import { Module } from '@nestjs/common'
import { CoingeckoService } from './services/coingecko.service'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [HttpModule],
    providers: [CoingeckoService],
})
export class CoingeckoModule {}

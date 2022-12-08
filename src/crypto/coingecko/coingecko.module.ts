import { Module } from '@nestjs/common';
import { CoingeckoService } from './coingecko/service/coingecko.service';
import { CoingeckoController } from './coingecko/coingecko.controller';
import { HttpModule } from '@nestjs/axios'


@Module({
  imports: [HttpModule],
  providers: [CoingeckoService],
  controllers: [CoingeckoController]
})
export class CoingeckoModule {}

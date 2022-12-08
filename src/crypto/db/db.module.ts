import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity';
import { CoingeckoService } from '../coingecko/coingecko/service/coingecko.service';
import { CryptoCurrencyMarketQueriesResolver } from './resolver/cryptoCurrency.resolver';
import { DbMutationResolver } from './resolver/db.resolver';
import { DbService } from './service/db.service';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports: [
      ScheduleModule.forRoot(),
      TypeOrmModule.forFeature([CryptoCurrencyMarket]), 
      HttpModule,
    ],
    providers: [
      DbMutationResolver,
      CryptoCurrencyMarketQueriesResolver,
      CoingeckoService,
      DbService,
    ],
    exports: []
})

export class DbModule {}
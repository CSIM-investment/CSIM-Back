import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoCurrencyMarket } from 'src/cryptoListApi/model/cryptocurrency.entity';
import { CryptoCurrencyMarketQueriesResolver } from './resolver/cryptoCurrency.queries.resolver';
import { DbMutationResolver } from './resolver/db.resolver';
import { DbService } from './service/db.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([CryptoCurrencyMarket])
    ],
    providers: [
      DbService, 
      DbMutationResolver, 
      CryptoCurrencyMarketQueriesResolver
    ]
})

export class DbModule {}
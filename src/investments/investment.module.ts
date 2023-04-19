import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DbService } from 'src/crypto/db/service/db.service'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentResolver } from './investment.resolver'
import { InvestmentService } from './investment.service'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { HttpModule } from '@nestjs/axios'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([InvestmentEntity, CryptoCurrencyMarket]),
        HttpModule,
    ],
    providers: [
        InvestmentEntity,
        InvestmentResolver,
        InvestmentService,
        DbService,
        CoingeckoService,
    ],
    exports: [TypeOrmModule, InvestmentService],
})
export class InvestmentModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentResolver } from './investment.resolver'
import { InvestmentService } from './services/investment.service'
import { ImportInvestmentService } from './services/import-investments.service'
import { HttpModule } from '@nestjs/axios'
import { UserInvestmentsResolver } from './user-investments.resolver'
import { SoldResolver } from './sold.resolver'
import { DbService } from 'src/crypto/db/service/db.service'
import { CoingeckoService } from 'src/crypto/coingecko/services/coingecko.service'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([InvestmentEntity, CryptoCurrencyMarket]),
        HttpModule,
    ],
    providers: [
        InvestmentEntity,
        InvestmentResolver,
        InvestmentService,
        ImportInvestmentService,
        UserInvestmentsResolver,
        SoldResolver,
        DbService,
        CoingeckoService,
    ],
    exports: [TypeOrmModule, InvestmentService],
})
export class InvestmentModule {}

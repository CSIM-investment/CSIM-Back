import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentResolver } from './investment.resolver'
import { InvestmentService } from './services/investment.service'
import { ImportInvestmentService } from './services/import-investments.service'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [TypeOrmModule.forFeature([InvestmentEntity]), HttpModule],
    providers: [
        InvestmentEntity,
        InvestmentResolver,
        InvestmentService,
        ImportInvestmentService,
    ],
    exports: [TypeOrmModule],
})
export class InvestmentModule {}

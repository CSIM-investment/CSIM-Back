import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentResolver } from './investment.resolver'
import { InvestmentService } from './investment.service'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([InvestmentEntity])],
  providers: [InvestmentEntity, InvestmentResolver, InvestmentService],
  exports: [TypeOrmModule],
})
export class InvestmentModule { }
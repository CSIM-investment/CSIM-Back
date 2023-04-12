import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { ReportsResolver } from './reports.resolver'
import { ReportService } from './reports.service'
import { InvestmentService } from '../investments/services/investment.service'
import { InvestmentEntity } from '../investments/entities/investment.entity'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvestmentReportDocument,
            InvestmentsReportsEntity,
            InvestmentsReportsInput,
            InvestmentEntity,
        ]),
    ],
    providers: [
        ReportService,
        ReportsResolver,
        InvestmentReportDocument,
        InvestmentsReportsEntity,
        InvestmentsReportsInput,
        InvestmentService,
        InvestmentEntity,
    ],
    exports: [TypeOrmModule],
})
export class ReportsModule {}

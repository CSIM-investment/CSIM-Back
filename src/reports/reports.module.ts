import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { ReportsResolver } from './reports.resolver'
import { ReportService } from './reports.service'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvestmentReportDocument,
            InvestmentsReportsEntity,
            InvestmentsReportsInput,
        ]),
    ],
    providers: [
        ReportService,
        ReportsResolver,
        InvestmentReportDocument,
        InvestmentsReportsEntity,
        InvestmentsReportsInput,
    ],
    exports: [TypeOrmModule],
})
export class ReportsModule {}

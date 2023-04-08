import { Args, Query, Resolver } from '@nestjs/graphql'
import { ReportService } from './reports.service'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InvestmentReportCreate } from './dto/InvestmentReports-create'

@Resolver(ReportsResolver)
export class ReportsResolver {
    constructor(private readonly reportService: ReportService) {}

    @Query(() => [InvestmentsReportsEntity])
    async reports(
        @Args('options') options: InvestmentsReportsInput,
    ): Promise<InvestmentsReportsEntity[]> {
        return []
    }

    @Query(() => InvestmentsReportsEntity)
    async createInvestmentReport(
        @Args('options') options: InvestmentReportCreate,
    ): Promise<InvestmentsReportsEntity> {
        console.log(options)
        let pdf_file = await this.reportService.generateInvestmentReports(
            options,
        )

        const investment_report_entity = new InvestmentsReportsEntity()
        investment_report_entity.mensualReport = false
        investment_report_entity.fromDate = options.fromDate

        return new InvestmentsReportsEntity()
    }
}

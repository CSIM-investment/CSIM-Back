import { Args, Query, Resolver } from '@nestjs/graphql'
import { ReportService } from './reports.service'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'

@Resolver(ReportsResolver)
export class ReportsResolver {
    constructor(private readonly reportService: ReportService) {}

    @Query(() => [InvestmentsReportsEntity])
    async reports(
        @Args('options') options: InvestmentsReportsInput,
    ): Promise<InvestmentsReportsEntity[]> {
        console.log(options)
        await this.reportService.generateInvestmentReports(options)
        return new Promise(() => {
            return [new InvestmentsReportsEntity()]
        })
    }
}

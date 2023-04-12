import { Args, Context, Parent, Query, Resolver } from '@nestjs/graphql'
import { ReportService } from './reports.service'
import { InvestmentsReportsInput } from './dto/inputs/InvestmentsReports-input'
import { InvestmentsReportsEntity } from './entities/InvestmentsReports.entity'
import { InvestmentReportCreate } from './dto/InvestmentReports-create'
import { InvestmentService } from '../investments/services/investment.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { User } from '../user/methods/user.methods'

@Resolver(ReportsResolver)
export class ReportsResolver {
    constructor(
        private readonly reportService: ReportService,
        private readonly investmentService: InvestmentService,
    ) {}

    @Query(() => [InvestmentsReportsEntity])
    async reports(
        @Args('options') options: InvestmentsReportsInput,
    ): Promise<InvestmentsReportsEntity[]> {
        return []
    }

    @Query(() => Number)
    @UseGuards(JwtAuthGuard)
    async sold(@Parent() { id }: User): Promise<number> {
        return this.reportService.soldUser(id)
    }

    @Query(() => InvestmentsReportsEntity)
    @UseGuards(JwtAuthGuard)
    async createInvestmentReport(
        @Args('options') options: InvestmentReportCreate,
        @Context() context,
    ): Promise<InvestmentsReportsEntity> {
        const invest1 = await this.investmentService.createInvestment(
            context.req.user,
            {
                type: 'in',
                quantity: 10,
                baseCurrencySymbol: 'eur',
                valueBaseCurrency: 1,
                quoteCurrencySymbol: 'sol',
                valueQuoteCurrency: 20,
                origin: 'uphold',
                status: 'completed',
                dateOfInvestment: '2023-04-09T20:01:00',
            },
        )
        await this.investmentService.createInvestment(context.req.user, {
            type: 'in',
            quantity: 5,
            baseCurrencySymbol: 'sol',
            valueBaseCurrency: 1,
            quoteCurrencySymbol: 'eur',
            valueQuoteCurrency: 1,
            origin: 'uphold',
            status: 'completed',
            dateOfInvestment: '2023-03-09T20:01:00',
        })
        await this.investmentService.createInvestment(context.req.user, {
            type: 'in',
            quantity: 5,
            baseCurrencySymbol: 'sol',
            valueBaseCurrency: 1,
            quoteCurrencySymbol: 'eur',
            valueQuoteCurrency: 1,
            origin: 'uphold',
            status: 'completed',
            dateOfInvestment: '2023-04-08T20:01:00',
        })
        await this.investmentService.createInvestment(context.req.user, {
            type: 'in',
            quantity: 5,
            baseCurrencySymbol: 'sol',
            valueBaseCurrency: 1,
            quoteCurrencySymbol: 'eur',
            valueQuoteCurrency: 1,
            origin: 'uphold',
            status: 'completed',
            dateOfInvestment: '2023-07-04T20:01:00',
        })

        let pdf_file = await this.reportService.generateInvestmentReports(
            options,
            context.req.user,
        )

        const investment_report_entity = new InvestmentsReportsEntity()
        investment_report_entity.mensualReport = false
        investment_report_entity.fromDate = options.fromDate

        return new InvestmentsReportsEntity()
    }
}
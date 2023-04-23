import {
    Args,
    Context,
    Mutation,
    Parent,
    Query,
    Resolver,
} from '@nestjs/graphql'
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
    @UseGuards(JwtAuthGuard)
    async reports(
        @Args('options') options: InvestmentsReportsInput,
        @Context() context,
    ): Promise<InvestmentsReportsEntity[]> {
        return this.reportService.search(options, context.req.user)
    }

    @Query(() => Number)
    @UseGuards(JwtAuthGuard)
    async sold(@Parent() { id }: User): Promise<number> {
        return this.reportService.soldUser(id)
    }

    @Mutation(() => InvestmentsReportsEntity)
    @UseGuards(JwtAuthGuard)
    async createInvestmentReport(
        @Args('options') options: InvestmentReportCreate,
        @Context() context,
    ): Promise<InvestmentsReportsEntity> {
        const investmentsReportsEntity: InvestmentsReportsEntity =
            await this.reportService.generateInvestmentReports(
                options,
                context.req.user,
            )

        return investmentsReportsEntity
    }
}

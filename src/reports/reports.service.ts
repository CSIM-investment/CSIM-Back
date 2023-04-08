import { Injectable } from '@nestjs/common'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'

@Injectable()
export class ReportService {
    async generateInvestmentReports(options): Promise<Buffer> {
        console.log(options)

        const investmentReport = new InvestmentReportDocument({
            investments: ['Investment 1', 'Investment 2', 'Investment 3'],
            gains: [
                '1 SOL - 23/03/2023 - 20 EUR -> 1 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
            startDate: options.startDate,
            endDate: options.endDate,
            sales: [
                '5 SOL - 23/03/2023 - 20 EUR -> 5 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
        })
        investmentReport.generate_investment_report_using_investments()
        return await investmentReport.to_pdf()
    }
}

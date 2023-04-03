import { Injectable } from '@nestjs/common'
import { InvestmentReportDocument } from './documents/InvestmentReportDocument'
import * as dayjs from 'dayjs'
import * as fs from 'fs'

@Injectable()
export class ReportService {
    async generateInvestmentReports(options): Promise<void> {
        console.log(options)

        const investmentReport = new InvestmentReportDocument({
            investments: ['Investment 1', 'Investment 2', 'Investment 3'],
            gains: [
                '1 SOL - 23/03/2023 - 20 EUR -> 1 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
            startDate: dayjs('20/02/2023', 'JJ/MM/YYYY'),
            endDate: dayjs(),
            sales: [
                '5 SOL - 23/03/2023 - 20 EUR -> 5 SOL - 24/03/2023 - 23 EUR --> 3 EUR',
            ],
        })
        investmentReport.generate_investment_report_using_investments()
        const buffer = await investmentReport.to_buffer()
        // Sauvegarder le fichier PDF
        fs.writeFileSync('mon-fichier.docx', buffer)
    }
}

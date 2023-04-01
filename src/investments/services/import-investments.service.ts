import { Injectable, Scope } from '@nestjs/common'
import { InvestmentService } from './investment.service'
import { InvestmentEntity } from '../entities/investment.entity'
import { User } from 'src/user/methods/user.methods'
import { CreateInvestmentInput } from '../dto/createInvestments.input'
import { firstValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConvertCsvToArrayOfCreateInputInvestmentService } from '../csv/ConvertCsvToArrayOfCreateInputInvestment.service'

@Injectable({ scope: Scope.REQUEST })
export class ImportInvestmentService {
    constructor(
        private readonly investmentsService: InvestmentService,
        private readonly httpService: HttpService,
    ) {}
    private user: User
    private investmentsData: CreateInvestmentInput[] = []

    async run(
        user: User,
        investmentsLink: string,
    ): Promise<InvestmentEntity[]> {
        this.user = user
        const investmentsCSV = await this.fetchInvestmentsData(investmentsLink)
        this.investmentsData =
            new ConvertCsvToArrayOfCreateInputInvestmentService().run(
                investmentsCSV,
            )
        return await this.createInvestments()
    }

    private async fetchInvestmentsData(
        investmentsLink: string,
    ): Promise<string> {
        const { data } = await firstValueFrom(
            this.httpService.get(investmentsLink),
        )
        return data
    }

    private async createInvestments(): Promise<InvestmentEntity[]> {
        const investmentsCSV = await Promise.all(
            this.investmentsData.map((investmentData) =>
                this.investmentsService.createInvestment(
                    this.user,
                    investmentData,
                ),
            ),
        )
        return investmentsCSV
    }
}

import { ConvertCsvToArrayOf } from 'src/csv/convert-csv-to-array.service'
import { CreateInvestmentInput } from '../dto/createInvestments.input'
import { InvestmentCsvOutput } from '../dto/investment-csv.output'

export class ConvertCsvToArrayOfCreateInputInvestmentService extends ConvertCsvToArrayOf<CreateInvestmentInput> {
    protected instantiate(data): CreateInvestmentInput {
        return new InvestmentCsvOutput(data).toCreateInvestmentInput()
    }
}

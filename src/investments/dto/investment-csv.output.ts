import { CreateInvestmentInput } from './createInvestments.input'

export class InvestmentCsvOutput {
    'Date': string
    'Destination': string
    'Destination Amount': number
    'Destination Currency': string
    'Fee Amount': string
    'Fee Currency': string
    'Id': string
    'Origin': string
    'Origin Amount': number
    'Origin Currency': string
    'Status': string
    'Type': string

    constructor(investment) {
        Object.assign(this, investment)
    }

    isSell(): boolean {
        return this['Type'] === 'EUR'
    }

    computeValueQuoteCurrency(): number {
        return this.isSell()
            ? this['Destination Amount'] * this['Origin Amount']
            : this['Origin Amount'] * this['Destination Amount']
    }

    toCreateInvestmentInput(): CreateInvestmentInput {
        return new CreateInvestmentInput({
            quantity: this['Destination Amount'],
            valueBaseCurrency: this['Origin Amount'],
            valueQuoteCurrency: this.computeValueQuoteCurrency(),
            quoteCurrencySymbol: this['Destination Currency'],
            baseCurrencySymbol: this['Origin Currency'],
            type: this['Type'],
            status: this['Status'],
            origin: this['Origin'],
        })
    }
}

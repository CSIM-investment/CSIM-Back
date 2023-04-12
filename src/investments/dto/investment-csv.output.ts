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
        return this['Destination Currency'] === 'eur'
    }

    computeValueQuoteCurrency(): number {
        return this.isSell()
            ? this['Destination Amount'] * this['Origin Amount']
            : this['Destination Amount']
    }

    computeValueBaseCurrency(): number {
        return this.isSell()
            ? this['Origin Amount']
            : this['Destination Amount'] * this['Origin Amount']
    }

    computeValueQuantity(): number {
        return this.isSell()
            ? this['Origin Amount']
            : this['Destination Amount']
    }

    toCreateInvestmentInput(): CreateInvestmentInput {
        return new CreateInvestmentInput({
            quantity: this.computeValueQuantity(),
            valueBaseCurrency: this.computeValueBaseCurrency(),
            valueQuoteCurrency: this.computeValueQuoteCurrency(),
            quoteCurrencySymbol: this['Destination Currency'].toLowerCase(),
            baseCurrencySymbol: this['Origin Currency'].toLowerCase(),
            type: this['Type'],
            status: this['Status'],
            origin: this['Origin'],
            dateOfInvestment: new Date(this['Date']).toISOString(),
        })
    }
}

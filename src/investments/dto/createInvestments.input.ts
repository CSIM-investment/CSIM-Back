export class CreateInvestmentInput {
    quantity: number
    valueBaseCurrency: number
    valueQuoteCurrency: number
    quoteCurrencySymbol: string
    baseCurrencySymbol: string
    type: string
    status: string
    origin: string
    dateOfInvestment: string

    constructor(investment) {
        Object.assign(this, investment)
    }
}

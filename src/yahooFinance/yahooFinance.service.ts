import {Injectable} from "@nestjs/common";
import * as moment from 'moment';
const yahooFinance = require('yahoo-finance');

@Injectable()
export class YahooFinanceService{
    private readonly yahooFinanceCurrencyName: string;

    constructor(
        private stockOrCryptoName: string,
        private currency: string = "EUR"
    ) {
        this.yahooFinanceCurrencyName = stockOrCryptoName + '-' + currency;
    }

    async checkCurrency(){
        if (!['USD', 'EUR'].includes(this.currency)) {
            throw Error("")
        }
    }

    async getHistory(beginDate?: moment.Moment, endDate?: moment.Moment){
        await this.checkCurrency()

        if(beginDate === undefined && endDate === undefined){
            endDate = moment();
        }

        if(beginDate === undefined){
            beginDate = endDate
            beginDate = endDate.subtract(1, 'day')
        }

        if(endDate === undefined){
            beginDate = endDate.add(1, 'day')
        }

        let data = [];

        let beginDateString = moment(beginDate).format("YYYY-MM-DD");
        let endDateString = moment(beginDate).format("YYYY-MM-DD");

        await yahooFinance.historical({
            symbol: this.yahooFinanceCurrencyName,
            from: beginDateString,
            to: endDateString,
        }, async function(err, quotes){
            if(err){
                throw Error(err);
            }

            data = quotes
        })

        return data;
    }
}
import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs/internal/Observable'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'

@Injectable()
export class CoingeckoService {
    BASE_URL = 'https://api.coingecko.com/api/v3'
    axios = require('axios')

    public getAllCoinsMarket(): Promise<CryptoCurrencyMarket[]> {
        return this.axios({
            url: `${this.BASE_URL}/coins/markets?vs_currency=EUR&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
            method: 'get',
        })
            .then(function (response) {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }

    public getCompleteExchanges(): Observable<any> {
        return this.axios({
            url: `${this.BASE_URL}/exchanges`,
            method: 'get',
        })
            .then(function (response) {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }

    public getExchangesList(): Observable<any> {
        return this.axios({
            url: `${this.BASE_URL}/exchanges/list`,
            method: 'get',
        })
            .then(function (response) {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }

    public getExchangeById(id: number): Observable<any> {
        return this.axios({
            url: `${this.BASE_URL}/exchanges/${id}`,
            method: 'get',
        })
            .then(function (response) {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }

    public getGlobalCryptocurrency(): Observable<any> {
        return this.axios({
            url: `${this.BASE_URL}/global`,
            method: 'get',
        })
            .then(function (response) {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

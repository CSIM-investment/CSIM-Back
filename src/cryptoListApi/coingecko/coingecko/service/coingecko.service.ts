import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { CryptoCurrencyMarket } from 'src/cryptoListApi/model/cryptocurrency.entity';


@Injectable()
export class CoingeckoService {
    
    BASE_URL = 'https://api.coingecko.com/api/v3';
    

    constructor(
        private _http           : HttpService,
    ) {}

    public getAllCoinsList (): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/coins/list`).pipe(
            map( response => response.data)
        )
    }

    public getAllCoinsMarket ( vs_currency : string ): Observable<CryptoCurrencyMarket>  {
        
        return this._http.get<CryptoCurrencyMarket>(`${this.BASE_URL}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`).pipe(
            map( response => response.data)
        )   
    }

    public getCoin ( id : number ): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/coins/${id}`).pipe(
            map( response => response)
        )
    }

    public getTickersByCoin ( id : number ): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/coins/${id}/tickers`).pipe(
            map( response => response.data)
        )
    }
    
    public getAllCategories (): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/coins/categories/list`).pipe(
            map( response => response.data)
        )
    }
    
    public getCompleteExchanges (): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/exchanges`).pipe(
            map( response => response.data)
        )
    }

    public getExchangesList (): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/exchanges/list`).pipe(
            map( response => response.data)
        )
    }

    public getExchangeById ( id : number ): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/exchanges/${id}`).pipe(
            map( response => response.data)
        )
    }

    public getGlobalCryptocurrency (): Observable<any>  {
        
        return this._http.get<any>(`${this.BASE_URL}/global`).pipe(
            map( response => response.data)
        )
    }
}
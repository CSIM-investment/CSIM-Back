import { Controller, Get, Param } from '@nestjs/common';
import { CoingeckoService } from './service/coingecko.service';

@Controller('coingecko')
export class CoingeckoController {

    crypto_array : any[] = []

    constructor(
        private readonly _coinGeckoService: CoingeckoService
    ) {}

    @Get('/coins/list')
    public getAllCoinsList () {
        
        this._coinGeckoService.getAllCoinsList().subscribe(resp => {
            console.log(resp);
            
        });
    }

    @Get('/coins/markets')
    public getAllCoinsMarket ( @Param() vs_currency ) {
        
        this._coinGeckoService.getAllCoinsMarket( vs_currency ).subscribe(resp => {

        });
    }

    @Get('/coins/:id')
    public getCoin ( @Param() param ) {
        console.log(param.id);
        
        this._coinGeckoService.getCoin( param.id ).subscribe(resp => {
           console.log(resp);
            
        });
    }

    @Get('/coins/:id/tickers')
    public getTickersByCoin ( @Param() param ) {
        
        this._coinGeckoService.getTickersByCoin( param.id ).subscribe(resp => {
            
        });
    }

    @Get('/coins/categories/list')
    public getAllCategories () {
        
        this._coinGeckoService.getAllCategories().subscribe(resp => {
            
        });
    }

    @Get('/exchanges')
    public getCompleteExchanges () {
        
        this._coinGeckoService.getCompleteExchanges().subscribe(resp => {
            
        });
    }

    @Get('/exchanges/list')
    public getExchangesList () {
        
        this._coinGeckoService.getExchangesList().subscribe(resp => {
            
        });
    }
    
    @Get('/coins/:id/tickers')
    public getExchangeById ( @Param() param ) {
        
        this._coinGeckoService.getExchangeById( param.id ).subscribe(resp => {
            
        });
    }
    
    @Get('/exchanges/list')
    public getGlobalCryptocurrency () {
        
        this._coinGeckoService.getGlobalCryptocurrency().subscribe(resp => {
            
        });
    }
}

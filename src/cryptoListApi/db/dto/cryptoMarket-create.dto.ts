import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/cryptoListApi/model/cryptocurrency.entity';

@InputType()
export class CryptoMarketInput {
    // @Field( () => ID )
    id : number
    
    @Field( () => String )
    symbol                              : string;
    
    @Field( () => String )
    name                                : string;
    
    @Field( () => String )
    image                               : string;
    
    @Field( () => Number)
    current_price                       : number;
    
    @Field( () => Number )
    market_cap                          : number;
    
    @Field( () => Number )
    market_cap_rank                     : number;
    
    @Field( () => Number )
    fully_diluted_valuation             : number;
    
    @Field( () => Number )
    total_volume                        : number;
    
    @Field( () => Number )
    high_24h                            : number;
    
    @Field( () => Number )
    low_24h                             : number;
    
    @Field( () => Number )
    price_change_24h                    : number;

    @Field( () => Number )
    price_change_percentage_24h         : number;
    
    @Field( () => Number )
    market_cap_change_24h               : number;
    
    @Field( () => Number )
    market_cap_change_percentage_24h    : number;
    
    @Field( () => Number )
    circulating_supply                  : number;
    
    @Field( () => Number )
    total_supply                        : number;
    
    @Field( () => Number )
    max_supply                          : number;
    
    @Field( () => Number )
    ath                                 : number;
    
    @Field( () => Number )
    ath_change_percentage               : number;
    
    @Field( () => Date )
    ath_date                            : Date;
    
    @Field( () => Number )
    atl                                 : number;
    
    @Field( () => Number )
    atl_change_percentage               : number;
    
    @Field( () => Date )
    atl_date                            : Date;
    
    @Field( () => Number )
    roi                                 : number;
    
    @Field( () => Date )
    last_updated                        : Date
}

@ObjectType()
export class CryptoMarketOutput {

    @Field( () => CryptoCurrencyMarket )
    cryptoCurrencyMarket : CryptoCurrencyMarket;
}
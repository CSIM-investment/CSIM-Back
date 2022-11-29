import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class CryptoCurrencyMarket extends BaseEntity{
    
    @Field( () => ID )
    @PrimaryGeneratedColumn('uuid')
    id : number
    
    @Field( () => String )
    @Column({ type : 'string' })
    symbol                              : string;
    
    @Field( () => String )
    @Column({ type : 'string' })
    name                                : string;
    
    @Field( () => String )
    @Column({ type : 'string' })
    image                               : string;
    
    @Field( () => Number)
    @Column({ type : 'int' })
    current_price                       : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    market_cap                          : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    market_cap_rank                     : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    fully_diluted_valuation             : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    total_volume                        : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    high_24h                            : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    low_24h                             : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    price_change_24h                    : number;

    @Field( () => Number )
    @Column({ type : 'int' })
    price_change_percentage_24h         : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    market_cap_change_24h               : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    market_cap_change_percentage_24h    : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    circulating_supply                  : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    total_supply                        : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    max_supply                          : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    ath                                 : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    ath_change_percentage               : number;
    
    @Field( () => Date )
    @Column({ type : 'timestamp' })
    ath_date                            : Date;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    atl                                 : number;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    atl_change_percentage               : number;
    
    @Field( () => Date )
    @Column({ type : 'timestamp' })
    atl_date                            : Date;
    
    @Field( () => Number )
    @Column({ type : 'int' })
    roi                                 : number;
    
    @Field( () => Date )
    @Column({ type : 'timestamp' })
    last_updated                        : Date
    
}

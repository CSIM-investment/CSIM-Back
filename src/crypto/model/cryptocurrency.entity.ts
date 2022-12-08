import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Node } from '../db/pagination/models/node.model';

@Entity()
@ObjectType()
export class CryptoCurrencyMarket extends Node{

    @Field(() => ID)
    @PrimaryColumn()
    unique_id                           : string;

    @Field()
    symbol                              : string;
    
    @Field()
    @Column()
    name                                : string;
    
    @Field()
    @Column()
    image                               : string;
    
    @Field()
    @Column({ type : 'int' })
    current_price                       : number;
    
    @Field()
    @Column({ type : 'int' })
    market_cap                          : number;
    
    @Field()
    @Column({ type : 'int' })
    market_cap_rank                     : number;
    
    @Field()
    @Column({ type : 'int' })
    fully_diluted_valuation             : number;
    
    @Field()
    @Column({ type : 'int' })
    total_volume                        : number;
    
    @Field()
    @Column({ type : 'int' })
    high_24h                            : number;
    
    @Field()
    @Column({ type : 'int' })
    low_24h                             : number;
    
    @Field()
    @Column({ type : 'int' })
    price_change_24h                    : number;

    @Field()
    @Column({ type : 'int' })
    price_change_percentage_24h         : number;
    
    @Field()
    @Column({ type : 'int' })
    market_cap_change_24h               : number;
    
    @Field()
    @Column({ type : 'int' })
    market_cap_change_percentage_24h    : number;
    
    @Field()
    @Column({ type : 'int' })
    circulating_supply                  : number;
    
    @Field()
    @Column({ type : 'int' })
    total_supply                        : number;
    
    @Field()
    @Column({ type : 'int' })
    max_supply                          : number;
    
    @Field()
    @Column({ type : 'int' })
    ath                                 : number;
    
    @Field()
    @Column({ type : 'int' })
    ath_change_percentage               : number;
    
    @Field()
    @Column({ type : 'timestamp' })
    ath_date                            : Date;
    
    @Field()
    @Column({ type : 'int' })
    atl                                 : number;
    
    @Field()
    @Column({ type : 'int' })
    atl_change_percentage               : number;
    
    @Field( () => Date )
    @Column({ type : 'timestamp' })
    atl_date                            : Date;
    
    @Field()
    @Column({ type : 'int' })
    roi                                 : number;
    
    @Field()
    @Column({ type : 'timestamp' })
    last_updated                        : Date
    
}

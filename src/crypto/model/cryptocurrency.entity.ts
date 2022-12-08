import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, PrimaryColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Node } from '../db/pagination/models/node.model';

@Entity()
@ObjectType()
export class CryptoCurrencyMarket extends Node{

    @Field(() => ID)
    @PrimaryColumn()
    id                           : string;

    @Field()
    symbol                              : string;
    
    @Field()
    @Column()
    name                                : string;
    
    @Field()
    @Column()
    image                               : string;
    
    @Field()
    @Column({ type : 'float' })
    current_price                       : number;
    
    @Field()
    @Column({ type : 'float' })
    market_cap                          : number;
    
    @Field()
    @Column({ type : 'int' })
    market_cap_rank                     : number;
    
    @Field()
    @Column({ type : 'float', nullable: true })
    fully_diluted_valuation             : number;
    
    @Field()
    @Column({ type : 'float' })
    total_volume                        : number;
    
    @Field()
    @Column({ type : 'float' })
    high_24h                            : number;
    
    @Field()
    @Column({ type : 'float' })
    low_24h                             : number;
    
    @Field()
    @Column({ type : 'float' })
    price_change_24h                    : number;

    @Field()
    @Column({ type : 'float' })
    price_change_percentage_24h         : number;
    
    @Field()
    @Column({ type : 'float' })
    market_cap_change_24h               : number;
    
    @Field()
    @Column({ type : 'float' })
    market_cap_change_percentage_24h    : number;
    
    @Field()
    @Column({ type : 'float', nullable: true })
    circulating_supply                  : number;
    
    @Field()
    @Column({ type : 'float', nullable: true })
    total_supply                        : number;
    
    @Field()
    @Column({ type : 'float', nullable: true })
    max_supply                          : number;
    
    @Field()
    @Column({ type : 'float' })
    ath                                 : number;
    
    @Field()
    @Column({ type : 'float' })
    ath_change_percentage               : number;
    
    @Field()
    @Column({ type : 'timestamp' })
    ath_date                            : Date;
    
    @Field()
    @Column({ type : 'float' })
    atl                                 : number;
    
    @Field()
    @Column({ type : 'float' })
    atl_change_percentage               : number;
    
    @Field( () => Date )
    @Column({ type : 'timestamp' })
    atl_date                            : Date;
    
    @Field()
    @Column({ nullable: true })
    roi                                 : string;
    
    @Field()
    @Column({ type : 'timestamp' })
    last_updated                        : Date
    
}

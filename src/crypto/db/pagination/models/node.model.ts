import { InterfaceType, Field, ID } from '@nestjs/graphql'
import { BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@InterfaceType()
export abstract class Node extends BaseEntity {
   
    @PrimaryGeneratedColumn()
    @Field( () => ID )
    id : number
    
    @Field( () => Date)
    @CreateDateColumn()
    CreatedAt: Date;
    
    @Field( () => Date)
    @UpdateDateColumn()
    UpdatedAt: Date;
}
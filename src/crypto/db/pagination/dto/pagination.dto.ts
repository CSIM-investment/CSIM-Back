import { Node } from "../models/node.model";
import { InterfaceType, Field, ArgsType, InputType, registerEnumType } from '@nestjs/graphql'


export enum SortDirection{
    ASC,
    DESC
}

registerEnumType(SortDirection, {
    name: 'SortDirection'
})

@InputType()
export class PaginationSortBy {
    @Field( () => SortDirection, {nullable: true})
    createdAt? : SortDirection
}

@ArgsType()
export class PaginationArgs {
    
    @Field()
    skip: number
    
    @Field()
    take: number
}

@InterfaceType()
export abstract class Pagination<N extends Node = Node> {

    @Field()
    totalCount: number;

    @Field( () => [Node])
    abstract nodes: N[];
}
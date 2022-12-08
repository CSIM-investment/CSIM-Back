import { ObjectType, Field, ArgsType, InputType } from "@nestjs/graphql";
import { CryptoCurrencyMarket } from "src/crypto/model/cryptocurrency.entity";
import { Pagination, PaginationArgs, PaginationSortBy, SortDirection } from "./pagination.dto";



@InputType()
export class CryptoCurrencyMarketPaginationSortBy extends PaginationSortBy {

    @Field( () => SortDirection, { nullable: true })
    title?: SortDirection;
}

@ArgsType()
export class CryptoCurrencyMarketPaginationArgs extends PaginationArgs {

    @Field( () => CryptoCurrencyMarketPaginationSortBy, { nullable: true })
    sortBy?: CryptoCurrencyMarketPaginationSortBy
}

@ObjectType()
export class CryptoCurrencyMarketPagination extends Pagination {

    @Field( () => [CryptoCurrencyMarket])
    nodes: CryptoCurrencyMarket[]
} 
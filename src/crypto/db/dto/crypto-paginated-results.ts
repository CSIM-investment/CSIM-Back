import { Field, ObjectType } from "@nestjs/graphql"
import { CryptoCurrencyMarket } from "src/crypto/model/cryptocurrency.entity"
import { PaginatedResults } from "../types/paginated-result"

@ObjectType()
export class CryptoCurrencyMarketPaginatedResults extends PaginatedResults<CryptoCurrencyMarket> {
    
    @Field(() => [CryptoCurrencyMarket])
    datas: CryptoCurrencyMarket[]
    
    @Field(() => Number)
    count: number
}
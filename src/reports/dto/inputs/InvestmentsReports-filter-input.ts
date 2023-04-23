import { Field, InputType } from '@nestjs/graphql'
import { PaginationInput } from '../../../articles/dto/inputs/pagination.input'

@InputType()
export class InvestmentsReportsFilterInput {
    @Field({ nullable: true })
    search?: string

    @Field({ nullable: true })
    pagination?: PaginationInput
}

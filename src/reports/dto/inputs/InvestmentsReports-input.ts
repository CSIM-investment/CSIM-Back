import { Field, InputType, Resolver } from '@nestjs/graphql'
import { InvestmentReportsOrderInput } from './investment-reports-order-input'
import { InvestmentsReportsFilterInput } from './InvestmentsReports-filter-input'

@InputType()
export class InvestmentsReportsInput {
    @Field({ nullable: true, defaultValue: {} })
    orderBy?: InvestmentReportsOrderInput

    @Field({ nullable: true, defaultValue: {} })
    filterBy?: InvestmentsReportsFilterInput
}

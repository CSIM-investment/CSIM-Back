import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class InvestmentReportCreate {
    @Field({ nullable: true, defaultValue: {} })
    fromDate: Date

    @Field({ nullable: true, defaultValue: {} })
    toDate: Date
}

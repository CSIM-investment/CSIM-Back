import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { User } from '../../user/methods/user.methods'

@Entity({ name: 'investments_reports' })
@ObjectType()
export class InvestmentsReportsEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number

    @CreateDateColumn()
    @Field(() => Date)
    fromDate: Date

    @CreateDateColumn()
    @Field(() => Date)
    toDate: Date

    @Column({ type: 'boolean' })
    @Field(() => Boolean)
    mensualReport: boolean

    @Column({ type: 'text' })
    @Field()
    reportUri: string

    @Field(() => User)
    @ManyToOne(() => User, (user: User) => user.investmentsReports)
    user: User
}

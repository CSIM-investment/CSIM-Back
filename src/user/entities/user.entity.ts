import { ObjectType, Field, ID } from '@nestjs/graphql'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { InvestmentEntity } from 'src/investments/entities/investment.entity'
import { Column, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { UserRoles } from '../enums/user-roles.enum'
import { UserStatus } from '../enums/user-status.enum'

@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  lastName: string

  @Column()
  @Field()
  firstName: string

  @Column({ unique: true })
  @Field()
  email: string

  @Field(() => UserRoles)
  @Column({
    default: UserRoles.user,
  })
  role: UserRoles

  @Field(() => UserStatus)
  @Column({
    default: UserStatus.isPending,
  })
  status: UserStatus

  @Column()
  password: string

  @Column({ nullable: true })
  refreshToken: string

  @Column({ nullable: true })
  emailCode: number

  @Field(() => [CryptoCurrencyMarket], { defaultValue: [] })
  @ManyToMany(() => CryptoCurrencyMarket)
  @JoinTable()
  favoritesCrypto: CryptoCurrencyMarket[]

  @Field(() => [InvestmentEntity], { defaultValue: [] })
  @OneToMany(() => InvestmentEntity, (investment) => investment.user)
  investments: InvestmentEntity[]
}

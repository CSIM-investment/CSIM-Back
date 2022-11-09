import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { UserRoles } from '../enums/user-roles.enum'
import { UserStatus } from '../enums/user-status.enum'

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field()
  lastName: string

  @Column()
  @Field()
  firstName: string

  @Column({ unique: false })
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
}

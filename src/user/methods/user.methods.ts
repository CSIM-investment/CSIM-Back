import { UnauthorizedException } from '@nestjs/common'
import { ObjectType } from '@nestjs/graphql'
import { UserEntity } from '../entities/user.entity'
import { UserRoles } from '../enums/user-roles.enum'
import { UserStatus } from '../enums/user-status.enum'
import * as bcrypt from 'bcrypt'
import { Entity } from 'typeorm'
import { AuthService } from 'src/auth/auth.service'

@Entity({ name: 'user' })
@ObjectType()
export class User extends UserEntity {
  constructor(user: Partial<UserEntity>) {
    super()
    Object.assign(this, user)
  }

  checkIfValidator(role: UserRoles): void {
    if (role !== UserRoles.validator) throw new UnauthorizedException()
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  isActive(): boolean {
    return this.status === UserStatus.isActive
  }

  activateAccount(): User {
    return new User({
      ...this,
      emailCode: null,
      status: UserStatus.isActive,
    })
  }

  async hasValidPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }

  addForgotPasswordCode(authService: AuthService): User {
    return new User({
      ...this,
      emailCode: authService.createSixDigitsCode(),
    })
  }

  resetPassword(password: string): User {
    return new User({
      ...this,
      emailCode: null,
      password,
    })
  }
}

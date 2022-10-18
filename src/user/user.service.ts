import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm/repository/Repository'
import { CreateUserInput } from './dto/create-user.input'
import { UserRoles } from './enums/user-roles.enum'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateOne(id: number, payload: Partial<User>): Promise<User> {
    await this.userRepository.findOneByOrFail({ id })
    return await this.userRepository.save({ id, ...payload })
  }

  async create(createUserInput: CreateUserInput) {
    const { email } = createUserInput
    const user = await this.userRepository.findOneBy({ email })
    if (user) throw new UnauthorizedException()
    return await this.userRepository.save(createUserInput)
  }

  checkIfValidator(role: UserRoles): void {
    if (role !== UserRoles.validator) throw new UnauthorizedException()
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`
  }
}

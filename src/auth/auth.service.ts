import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { CreateUserInput } from 'src/user/dto/create-user.input'
import { LoginResponse } from './dto/login-response'
import { EmailService } from '../email/email.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/methods/user.methods'
import { TokenService } from './token.service'
import { getRounds, hash } from 'bcrypt'
import { randomInt } from 'node:crypto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private emailService: EmailService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneByOrFail({ email })

    if (!(await user.hasValidPassword(password)) || !user.isActive())
      throw new UnauthorizedException()

    return user
  }

  async login(user: User): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.tokenService.signs(user)
    await this.userRepository.update(user.id, { refreshToken })
    return {
      refreshToken,
      accessToken,
      user,
    }
  }

  async register(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userService.insertOneAndGet(createUserInput)
    await this.emailService.sendRegisterConfirmation(user)
    return user
  }

  async sendRegisterConfirmation(email: string): Promise<User> {
    const user = await this.userRepository.findOneByOrFail({ email })
    await this.emailService.sendRegisterConfirmation(user)
    return user
  }

  async confirmEmail(emailCode: number, email: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOneByOrFail({ emailCode, email })
    const [loginResponse] = await Promise.all([
      this.login(user),
      this.userRepository.save(user.activateAccount()),
    ])
    return loginResponse
  }

  async sendForgotPasswordCode(email: string): Promise<string> {
    let user = await this.userRepository.findOneByOrFail({ email })
    user = await this.userRepository.save(user.addForgotPasswordCode(this))
    await this.emailService.sendForgotPasswordCode(user)
    return 'un email a été envoyé pour mettre à jour votre mot de passe'
  }

  createSixDigitsCode(): number {
    return randomInt(100000, 999999)
  }

  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10)
  }

  isHashed(hash: string): boolean {
    try {
      return getRounds(hash) === 10
    } catch {
      return false
    }
  }

  async resetPassword(
    email: string,
    emailCode: number,
    password: string,
  ): Promise<LoginResponse> {
    const user = await this.userRepository.findOneByOrFail({ email, emailCode })
    const [loginResponse] = await Promise.all([
      this.login(user),
      this.userRepository.update({ id: user.id }, user.resetPassword(password)),
    ])
    return loginResponse
  }
}

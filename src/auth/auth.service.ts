import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import * as bcrypt from 'bcrypt'
import { CreateUserInput } from 'src/user/dto/create-user.input'
import { LoginResponse } from './dto/login-response'
import { EmailService } from '../email/email.service'
import { User } from 'src/user/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserStatus } from 'src/user/enums/user-status.enum'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneByOrFail({ email })

    const hasCorrectPassword = await bcrypt.compare(password, user?.password)
    if (!hasCorrectPassword) throw new UnauthorizedException()

    return user
  }

  async login(user: User): Promise<LoginResponse> {
    const { accessToken, refreshToken } = await this.signTokens(user)
    await this.userRepository.update(user.id, { refreshToken })

    return {
      refreshToken,
      accessToken,
      user,
    }
  }

  async register(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userService.create(createUserInput)
    await this.emailService.sendRegisterConfirmation(user)
    return user
  }

  async refreshTokens(
    refreshToken: string,
    id: number,
  ): Promise<LoginResponse> {
    const user = await this.resolveRefreshToken(refreshToken, id)
    const tokens = await this.signTokens(user)
    return { ...tokens, user }
  }

  private async signTokens(user: User): Promise<{
    refreshToken: string
    accessToken: string
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user),
      this.signRefreshToken(user),
    ])
    await this.userService.updateOne(user.id, { refreshToken })
    return { accessToken, refreshToken }
  }

  private async signToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    }
    const token = this.jwtService.sign(payload)
    return token
  }

  private async signRefreshToken(user: User): Promise<string> {
    const payload = {
      email: user.email,
      sub: user.id,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    }
    const token = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    })
    return token
  }

  private async verifyRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
    } catch (err) {
      throw new UnauthorizedException('Refresh token not valid')
    }
  }

  private async resolveRefreshToken(
    refreshToken: string,
    id: number,
  ): Promise<User> {
    const [user] = await Promise.all([
      this.userRepository.findOneByOrFail({ refreshToken, id }),
      this.verifyRefreshToken(refreshToken),
    ])
    return user
  }

  async confirmEmail(emailCode: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOneByOrFail({ emailCode })
    const [loginResponse] = await Promise.all([
      this.login(user),
      this.userRepository.save({
        ...user,
        emailCode: null,
        status: UserStatus.isActive,
      }),
    ])
    return loginResponse
  }
}

import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/methods/user.methods'
import { UserService } from 'src/user/user.service'
import { Repository } from 'typeorm'
import { LoginResponse } from './dto/login-response'
import { AccessToken } from './models/access-token.model'
import { RefreshToken } from './models/refresh-token.model'

@Injectable()
export class TokenService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async refresh(tokenToVerify: string): Promise<LoginResponse> {
    const refreshToken = new RefreshToken(this.jwtService, this.userRepository)
    const user = await refreshToken.resolve(tokenToVerify)
    const tokens = await this.signs(user)
    return { ...tokens, user }
  }

  async signs(user: User): Promise<{
    refreshToken: string
    accessToken: string
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      new AccessToken(this.jwtService).sign(user),
      new RefreshToken(this.jwtService, this.userRepository).sign(user),
    ])
    await this.userService.update(user.id, { refreshToken })
    return { accessToken, refreshToken }
  }
}

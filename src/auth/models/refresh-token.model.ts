import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/methods/user.methods'
import { Repository } from 'typeorm'
import { Token } from './token.model'

export class RefreshToken extends Token {
  constructor(jwtService: JwtService, private userRepository: Repository<User>) {
    super(process.env.REFRESH_TOKEN_EXPIRATION_TIME, jwtService, process.env.REFRESH_TOKEN_SECRET)
  }

  private async verify(refreshToken: string): Promise<void> {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.secret,
      })
    } catch (err) {
      throw new UnauthorizedException('Refresh token not valid')
    }
  }

  public async resolve(refreshToken: string): Promise<User> {
    const [user] = await Promise.all([
      this.userRepository.findOneByOrFail({ refreshToken }),
      this.verify(refreshToken),
    ])
    return user
  }
}

import { JwtService } from '@nestjs/jwt'
import { User } from 'src/user/methods/user.methods'

export abstract class Token {
  protected value: string

  constructor(
    protected expireTime: string,
    protected jwtService: JwtService,
    protected secret: string,
  ) {}

  sign(user: User): string {
    const tokenToSign = {
      email: user.email,
      sub: user.id,
      expiresIn: this.expireTime,
    }
    this.value = this.jwtService.sign(tokenToSign, {
      secret: this.secret,
    })
    return this.value
  }
}
import { JwtService } from '@nestjs/jwt'
import { Token } from './token.model'

export class AccessToken extends Token {
  constructor(jwtService: JwtService) {
    super(process.env.ACCESS_TOKEN_EXPIRATION_TIME, jwtService, process.env.ACCESS_TOKEN_SECRET)
  }
}

import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { LocalStrategy } from './strategies/local.strategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt-strategy'
import { UserModule } from 'src/user/user.module'
import { EmailModule } from 'src/email/email.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME },
      secret: process.env.ACCESS_TOKEN_SECRET,
    }),
    UserModule,
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
})
export class AuthModule {}

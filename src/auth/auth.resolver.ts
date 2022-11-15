import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'src/user/methods/user.methods'
import { CreateUserInput } from '../user/dto/create-user.input'
import { AuthService } from './auth.service'
import { LoginResponse } from './dto/login-response'
import { LoginUserInput } from './dto/login-user.input'
import { GqlAuthGuard } from './guards/gql-auth-guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { TokenService } from './token.service'

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Mutation(() => User)
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput)
  }

  @Mutation(() => LoginResponse)
  confirmEmail(
    @Args('emailCode') emailCode: number,
    @Args('email') email: string,
  ) {
    return this.authService.confirmEmail(emailCode, email)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LoginResponse)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LoginResponse)
  refreshTokens(
    @Args('refreshToken') refreshToken: string,
    @Context() context,
  ) {
    return this.tokenService.refresh(context.req.user.id, refreshToken)
  }

  @Mutation(() => String)
  sendResetPasswordCode(@Args('email') email: string) {
    return this.authService.sendForgotPasswordCode(email)
  }

  @Mutation(() => LoginResponse)
  resetPassword(
    @Args('email') email: string,
    @Args('emailCode') code: number,
    @Args('newPassword') password: string,
  ) {
    return this.authService.resetPassword(email, code, password)
  }
}

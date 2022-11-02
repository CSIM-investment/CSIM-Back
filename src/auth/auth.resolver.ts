import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'src/user/entities/user.entity'
import { CreateUserInput } from '../user/dto/create-user.input'
import { AuthService } from './auth.service'
import { LoginResponse } from './dto/login-response'
import { LoginUserInput } from './dto/login-user.input'
import { GqlAuthGuard } from './guards/gql-auth-guard'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LoginResponse)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user)
  }

  @Mutation(() => User)
  register(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput)
  }

  @Mutation(() => LoginResponse)
  confirmEmail(@Args('emailCode') emailCode: number) {
    return this.authService.confirmEmail(emailCode)
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => LoginResponse)
  refreshTokens(
    @Args('refreshToken') refreshToken: string,
    @Context() context,
  ) {
    return this.authService.refreshTokens(refreshToken, context.req.user.id)
  }
}

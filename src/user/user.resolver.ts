import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql'
import { UserService } from './user.service'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateUserInput } from './dto/update-user.input'
import { User } from './methods/user.methods'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateAccount(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Context() context,
  ): Promise<User> {
    return this.userService.updateAndGet(context.req.user.id, updateUserInput)
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  account(@Context() context): Promise<User> {
    return context.req.user
  }
}

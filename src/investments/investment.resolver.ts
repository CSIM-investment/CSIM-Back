import { UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { CreateInvestmentInput } from './dto/createInvestments.input'
import { InvestmentEntity } from './entities/investment.entity'
import { InvestmentService } from './investment.service'

@Resolver(() => InvestmentEntity)
export class InvestmentResolver {
  constructor(private readonly investmentService: InvestmentService) { }

  @Mutation(() => InvestmentEntity)
  @UseGuards(JwtAuthGuard)
  createInvestment(
    @Args('createInvestmentInput') createInvestmentInput: CreateInvestmentInput,
    @Context() context,
  ): Promise<InvestmentEntity> {
    return this.investmentService.createInvestment(context.req.user.id, createInvestmentInput)
  }
}

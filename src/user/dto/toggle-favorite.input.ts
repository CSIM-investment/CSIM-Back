import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class ToggleFavoriteInput {
  @Field()
  cryptoId: string

  @Field(() => Boolean)
  hadToFavorite: boolean
}
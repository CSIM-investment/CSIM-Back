import { ObjectType, OmitType } from '@nestjs/graphql'
import { Article } from '../methods/article.methods'

@ObjectType()
export class CreateArticle extends OmitType(Article, ['id']) {
  constructor(createArticle: CreateArticle) {
    super()
    Object.assign(this, createArticle)
  }
}

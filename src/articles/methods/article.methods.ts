import { ObjectType } from '@nestjs/graphql'
import { Entity } from 'typeorm'
import { ArticleEntity } from '../entities/article.entity'

@Entity({ name: 'article' })
@ObjectType()
export class Article extends ArticleEntity {}

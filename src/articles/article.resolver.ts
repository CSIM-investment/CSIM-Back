import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ArticleService } from './services/article.service'
import { Article } from './methods/article.methods'
import { Cron } from '@nestjs/schedule'
import { ArticlesInput } from './dto/inputs/articles.input'

@Resolver()
export class ArticleResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => String)
  @Cron('0 0 4 * * *')
  updateArticles(): Promise<string> {
    return this.articleService.update()
  }

  @Cron('0 0 0 1 * *')
  deleteArticlesFromYesterday(): Promise<string> {
    return this.articleService.deleteFromYesterday()
  }

  @Query(() => [Article])
  articles(@Args('options') options: ArticlesInput): Promise<Article[]> {
    return this.articleService.search(options)
  }
}

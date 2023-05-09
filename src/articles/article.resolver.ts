import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ArticleService } from './services/article.service'
import { Article } from './methods/article.methods'
import { Cron } from '@nestjs/schedule'
import { ArticlesInput } from './dto/inputs/articles.input'
import { Int } from '@nestjs/graphql'

@Resolver()
export class ArticleResolver {
    constructor(private readonly articleService: ArticleService) {}

    @Mutation(() => String)
    // @Cron('0 0 4 * * *')
    updateArticles(
        @Args({ name: 'hours', type: () => Int, defaultValue: 4 })
        hours: number,
    ): Promise<string> {
        return this.articleService.update(hours)
    }

    // @Cron('0 0 0 1 * *')
    deleteArticlesFromYesterday(): Promise<string> {
        return this.articleService.deleteFromYesterday()
    }

    @Query(() => [Article])
    articles(@Args('options') options: ArticlesInput): Promise<Article[]> {
        return this.articleService.search(options)
    }
}

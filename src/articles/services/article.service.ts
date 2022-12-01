import { Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'
import { Brackets, LessThan } from 'typeorm'
import { GoogleNewsApiService } from './google-news-api.service'
import { Article } from '../methods/article.methods'
import { ArticlesInput } from '../dto/inputs/articles.input'
import { YahooFinanceNewsService } from './yahoo-finance-news.service'
import { ArticleRepository } from '../repositories/article.repository'

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly googleNewsApiService: GoogleNewsApiService,
    private readonly yahooFinanceNewsService: YahooFinanceNewsService,
  ) {}

  async update(): Promise<string> {
    const { articles } = await this.googleNewsApiService.getFromHoursToNow(4)
    const articlesSaved = await this.articleRepository.saveOrIgnore(articles)
    return `created ${articlesSaved} article(s)`
  }

  async deleteFromYesterday(): Promise<string> {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')
    const { affected } = await this.articleRepository
      .createQueryBuilder('user')
      .delete()
      .where({ publishedDate: LessThan(yesterday) })
      .execute()
    return `deleted ${affected} article(s)`
  }

  async search(articlesInput: ArticlesInput): Promise<Article[]> {
    const { orderBy, filterBy } = articlesInput
    const { symbol, pagination, search } = filterBy

    let query = this.articleRepository.createQueryBuilder().select()

    if (symbol) {
      await this.yahooFinanceNewsService.saveNewArticles(articlesInput)
      query = query.where(`symbol = :symbol`, { symbol })
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(`title LIKE :title`, { title: `%${search}%` })
            .orWhere(`description LIKE :description`, { description: `%${search}%` })
            .orWhere(`symbol LIKE :symbol`, { symbol: `%${search}%` })
            .orWhere(`author LIKE :author`, { author: `%${search}%` })
            .orWhere(`source LIKE :source`, { source: `%${search}%` })
        }),
      )
    }
    if (pagination) query = query.limit(pagination.end).offset(pagination.start)
    if (orderBy) query = query.orderBy(orderBy.name, orderBy.direction)

    return await query.getMany()
  }
}

import { Injectable } from '@nestjs/common'
import { get } from 'yahoo-finance-news'
import { ArticlesInput } from '../dto/inputs/articles.input'
import { YahooFinanceNewsArticle } from '../dto/yahoo-finance-news-article'
import { ArticleRepository } from '../repositories/article.repository'

@Injectable()
export class YahooFinanceNewsService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async saveNewArticles(articlesInput: ArticlesInput): Promise<void> {
    const { filterBy } = articlesInput
    const { symbol } = filterBy
    const yahooFinanceNewsArticles: YahooFinanceNewsArticle[] = await get({
      symbols: symbol,
      language: 'en',
    })

    const articles = yahooFinanceNewsArticles.map(({ title, description, link, date }) =>
      new YahooFinanceNewsArticle(title, description, link, date, symbol).toCreateArticle(),
    )
    await this.articleRepository.saveOrIgnore(articles)
  }
}

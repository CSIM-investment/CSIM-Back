import { Injectable } from '@nestjs/common'
import { Repository, DataSource } from 'typeorm'
import { Article } from '../methods/article.methods'
import { CreateArticle } from '../models/create-article.input'

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager())
  }

  async saveOrIgnore(articles: CreateArticle[]): Promise<number> {
    const queryResult = await this.createQueryBuilder().insert().values(articles).orIgnore().execute()
    return queryResult.raw.affectedRows
  }
}

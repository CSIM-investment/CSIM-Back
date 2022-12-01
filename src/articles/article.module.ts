import { Module } from '@nestjs/common'
import { ArticleService } from './services/article.service'
import { ArticleResolver } from './article.resolver'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './methods/article.methods'
import { GoogleNewsApiService } from './services/google-news-api.service'
import { YahooFinanceNewsService } from './services/yahoo-finance-news.service'
import { ArticleRepository } from './repositories/article.repository'

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Article]), HttpModule],
  providers: [
    ArticleResolver,
    ArticleService,
    GoogleNewsApiService,
    YahooFinanceNewsService,
    ArticleRepository,
  ],
})
export class ArticleModule {}

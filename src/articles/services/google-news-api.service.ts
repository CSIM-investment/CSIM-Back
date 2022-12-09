import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { CreateArticle } from '../models/create-article.input'
import { GoogleNewsApiResponse } from '../dto/google-news-api-response'
import { GoogleNewsApiArticle } from '../dto/google-news-api-article'
import * as dayjs from 'dayjs'

@Injectable()
export class GoogleNewsApiService {
  constructor(private readonly httpService: HttpService) {
    this.url = process.env.ARTICLES_API_URL
    this.apiKey = process.env.ARTICLES_API_KEY
  }
  private readonly url: string
  private subject: string
  private readonly apiKey: string

  private getDateFromHoursAgo(hours: number): string {
    const dateWithApiFormat = dayjs().subtract(hours, 'hours').format('YYYY-MM-DDTHH:mm:ss')
    return dateWithApiFormat
  }

  private getApiUrl(): string {
    return `${this.url}?q=${this.subject}&apiKey=${this.apiKey}&sortBy=popularity`
  }

  async getFromHoursToNow(hours: number): Promise<GoogleNewsApiResponse<CreateArticle>> {
    const apiUrl = `${this.getApiUrl()}&from=${this.getDateFromHoursAgo(hours)}`
    this.subject = 'crypto'
    const { data } = await firstValueFrom(
      this.httpService.get<GoogleNewsApiResponse<GoogleNewsApiArticle>>(apiUrl),
    )
    const articles = data.articles.map((article) => new GoogleNewsApiArticle(article).toCreateArticle())
    const apiResponseWithArticlesToSaved = { ...data, articles }
    return apiResponseWithArticlesToSaved
  }
}

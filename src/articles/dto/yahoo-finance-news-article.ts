import { CreateArticle } from '../models/create-article.input'

export class YahooFinanceNewsArticle {
  constructor(
    public title: string,
    public description: string,
    public link: string,
    public date: string,
    public symbol: string,
  ) {}

  toCreateArticle(): CreateArticle {
    const article: CreateArticle = {
      title: this.title,
      description: this.description,
      source: null,
      author: null,
      publishedDate: new Date(this.date),
      symbol: this.symbol,
      url: this.link,
    }
    return new CreateArticle(article)
  }
}

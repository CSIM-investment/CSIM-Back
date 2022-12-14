import { CreateArticle } from '../models/create-article.input'

export class GoogleNewsApiArticle {
  symbol: string
  source: {
    id: string
    name: string
  }
  author: string
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: Date
  content: string

  constructor(article: GoogleNewsApiArticle) {
    Object.assign(this, article)
  }

  toCreateArticle(): CreateArticle {
    const article: CreateArticle = {
      title: this.title,
      description: this.description,
      source: this.source.name,
      author: this.author,
      publishedDate: new Date(this.publishedAt),
      url: this.url,
      symbol: null,
      picture: this.urlToImage,
    }
    return new CreateArticle(article)
  }
}

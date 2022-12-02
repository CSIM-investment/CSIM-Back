export class GoogleNewsApiResponse<T> {
  status: string
  totalResults: number
  articles: T[]
}

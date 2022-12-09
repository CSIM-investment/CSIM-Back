import { registerEnumType } from '@nestjs/graphql'

export enum ArticleOrderBy {
  'publishedDate' = 'publishedDate',
}

registerEnumType(ArticleOrderBy, {
  name: 'ArticleOrderBy',
})

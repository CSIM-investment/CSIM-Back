import { registerEnumType } from '@nestjs/graphql'

export enum CryptoOrderBy {
  'publishedDate' = 'publishedDate',
}

registerEnumType(CryptoOrderBy, {
  name: 'CryptoOrderBy',
})

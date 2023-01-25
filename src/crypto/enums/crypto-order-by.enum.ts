import { registerEnumType } from '@nestjs/graphql'

export enum CryptoOrderBy {
  'market_cap'        = 'market_cap',
  'current_price'     = 'current_price',
  'high_24h'          = 'high_24h',
  'low_24'            = 'low_24'
}

registerEnumType(CryptoOrderBy, {
  name: 'CryptoOrderBy',
})

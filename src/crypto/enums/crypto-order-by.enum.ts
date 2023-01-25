import { registerEnumType } from '@nestjs/graphql'

export enum CryptoOrderBy {
  'market_cap'                  = 'market_cap',
  'current_price'               = 'current_price',
  'high_24h'                    = 'high_24h',
  'low_24'                      = 'low_24',
  'price_change_percentage_24h' = 'price_change_percentage_24h'
}

registerEnumType(CryptoOrderBy, {
  name: 'CryptoOrderBy',
})

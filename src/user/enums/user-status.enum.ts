import { registerEnumType } from '@nestjs/graphql'

export enum UserStatus {
  'isPending' = 'isPending',
  'isActive' = 'isActive',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
})

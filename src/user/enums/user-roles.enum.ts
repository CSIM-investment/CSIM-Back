import { registerEnumType } from '@nestjs/graphql'

export enum UserRoles {
  'admin' = 'admin',
  'validator' = 'validator',
  'user' = 'user',
  'visitor' = 'visitor',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
})
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm'
import { User } from './methods/user.methods'
import { AuthService } from 'src/auth/auth.service'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource, private authService: AuthService) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return User
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.emailCode = this.authService.createSixDigitsCode()
    event.entity.password = await this.authService.hashPassword(
      event.entity.password,
    )
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const isUpdatingPassword = event.entity.password !== undefined
    if (!isUpdatingPassword || this.authService.isHashed(event.entity.password))
      return

    event.entity.password = await this.authService.hashPassword(
      event.entity.password,
    )
  }
}

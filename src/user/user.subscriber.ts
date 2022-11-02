import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return User
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.emailCode = this.generateEmailCode()
    event.entity.password = await bcrypt.hash(event.entity.password, 10)
  }

  generateEmailCode(): number {
    return Math.floor(100000 + Math.random() * 900000)
  }
}

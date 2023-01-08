import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm/repository/Repository'
import { CreateUserInput } from './dto/create-user.input'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './methods/user.methods'
import { UserEntity } from './entities/user.entity'
import { ToggleFavoriteInput } from './dto/toggle-favorite.input'
import { CryptoCurrencyMarket } from 'src/crypto/model/cryptocurrency.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CryptoCurrencyMarket)
    private cryptoRepository: Repository<CryptoCurrencyMarket>,
  ) {}

  async update(user: Partial<UserEntity> | number, payload: Partial<User>): Promise<void> {
    await this.userRepository.update(user, { ...payload })
  }

  async insertOneAndGet(createUserInput: CreateUserInput): Promise<User> {
    const user = await this.userRepository.insert(createUserInput)
    return await this.userRepository.findOneBy({
      id: user.identifiers[0].id,
    })
  }

  async updateAndGet(id: number, payload: Partial<User>): Promise<User> {
    await this.userRepository.update({ id }, { ...payload })
    return await this.userRepository.findOneBy({ id })
  }

  async toggleFavoriteCrypto(userId: number, input: ToggleFavoriteInput): Promise<User> {
    const [crypto, user] = await Promise.all([
      this.cryptoRepository.findOneByOrFail({ id: input.cryptoId }),
      this.getUserWithFavoritesCrypto(userId),
    ])
    user.favoritesCrypto = input.hadToFavorite
      ? [...user.favoritesCrypto, crypto]
      : user.favoritesCrypto.filter((crypto) => crypto.id !== input.cryptoId)
    await this.userRepository.save(user)
    return user
  }

  async getUserWithFavoritesCrypto(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      relations: ['favoritesCrypto'],
      where: { id: userId },
    })
    return user
  }
}

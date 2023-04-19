import { Global, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserSubscriber } from './user.subscriber'
import { UserEntity } from './entities/user.entity'
import { User } from './methods/user.methods'
import { CryptoCurrencyMarket } from 'src/crypto/entities/cryptocurrency.entity'
import { InvestmentModule } from 'src/investments/investment.module'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        TypeOrmModule.forFeature([CryptoCurrencyMarket]),
        UserEntity,
        InvestmentModule,
    ],
    providers: [UserService, UserResolver, UserSubscriber, UserEntity],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}

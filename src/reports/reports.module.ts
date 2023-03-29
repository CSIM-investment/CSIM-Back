import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers: [],
    exports: [TypeOrmModule],
})
export class InvestmentModule {}

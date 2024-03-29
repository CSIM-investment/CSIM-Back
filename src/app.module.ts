import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailModule } from './email/email.module'
import { DbModule } from './crypto/db/db.module'
import { ArticleModule } from './articles/article.module'
import { InvestmentModule } from './investments/investment.module'
import { ReportsModule } from './reports/reports.module'

type DatabaseType = 'mysql' | 'postgres'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            introspection: true,
            playground: true,
            cache: 'bounded',
            persistedQueries: {
                ttl: 900,
            },
        }),
        TypeOrmModule.forRoot({
            type: process.env.DATABASE_TYPE as DatabaseType,
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            autoLoadEntities: true,
            synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
        }),
        EmailModule,
        UserModule,
        AuthModule,
        DbModule,
        ArticleModule,
        InvestmentModule,
        ReportsModule,
    ],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import {YahooFinanceService} from "./crypto/yahoo-finance.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  })
  const port = process.env.PORT || 4000

  console.log(await new YahooFinanceService('SHIB').getHistory())
  return;
  await app.listen(port)
  console.log(`server listen on localhost:${port}/graphql`)
}
bootstrap()

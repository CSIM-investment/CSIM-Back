import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
  })
  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`server listen on localhost:${port}/graphql`)
}
bootstrap()

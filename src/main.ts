import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
    })
    app.useGlobalPipes(new ValidationPipe())

    const options = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    }
    //app.use(cors(options))
    app.enableCors(options)

    const port = process.env.PORT || 4000

    await app.listen(port)
    console.log(`server listen on http://localhost:${port}/graphql`)
}
bootstrap()

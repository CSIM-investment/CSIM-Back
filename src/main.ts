import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common'
import * as admin from 'firebase-admin'

async function bootstrap(): Promise<void> {
    const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')

    const firebaseConfig = {
        projectId: process.env.PROJECT_ID,
        privateKey,
        clientEmail: process.env.CLIENT_EMAIL,
    }

    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
    })

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        cors: true,
    })

    const options = {
        origin: 'localhost, http://csim-finance.com',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    }
    //app.use(cors(options))
    app.enableCors(options)

    app.useGlobalPipes(new ValidationPipe())
    /*app.enableCors({
      origin: process.env.CORS_ORIGIN,
    })*/
    const port = process.env.PORT || 4000

    await app.listen(port)
    console.log(`server listen on http://localhost:${port}/graphql`)
}
bootstrap()

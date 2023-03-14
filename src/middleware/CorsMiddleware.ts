import { NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

export class CorsMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: NextFunction): void {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
  }
}

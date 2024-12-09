import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsPrivateNetworkMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Private-Network', 'true');
        next();
    }
}

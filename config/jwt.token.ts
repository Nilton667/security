import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express';
import JwtPayload from '../model/jwtPayload';

const myLogger = function (req: Request, res: Response, next: NextFunction) {
  try {
    let decoded = jwt.verify(req.headers.token as string, process.env.PRIVATE_KEY as string) as JwtPayload
    req.body.id = decoded.id;
    next();
  } catch (error) {
    res.json('token-error');
  }
}

export default myLogger;
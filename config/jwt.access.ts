import 'dotenv/config'
import { Request, Response, NextFunction } from 'express';

const access = (req: Request, res: Response, next: NextFunction) => {
    try {
      if(req.headers['access-key'] == process.env.ACCESS_KEY){
        next();
      }else{
        res.json('access-error');
      }
    } catch (error) {
      res.json('access-error');
    }
}

export default access;
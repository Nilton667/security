import express from 'express';
import { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', (req: Request, res: any, next: NextFunction) => {
  res.render('index', { title: 'HorizonPay', description: ''});
});

export default router

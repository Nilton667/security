import express from 'express'
var router = express.Router();
import recoverClass from '../class/recover'
import { Request, Response, NextFunction } from 'express'
const recover = new recoverClass();

router.post('/recover/telemovel', async (req: Request, res: Response, next: NextFunction) => {
    let result = await recover.recoverPhone(req.body.telemovel ?? '');
    return res.json(result);
});

router.post('/recover/token', async (req: Request, res: Response, next: NextFunction) => {
    let result = await recover.recoverToken(
        {
            token: req.body.token ?? '',
            keycode: req.body.keycode ?? '',
        }
    );
    return res.json(result);
});

router.post('/recover/update/password', async (req: Request, res: Response, next: NextFunction) => {
    let result = await recover.recoverPassword(
        {
            phone: req.body.telemovel, 
            password: req.body.password, 
            token: req.body.token, 
            keycode: req.body.keycode,
            device: req.body.dispositivo
        }
    );
    return res.json(result);
});

export default router;
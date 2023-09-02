import express from 'express'
var router = express.Router()
import loginClass from '../class/login'
import { Request, Response, NextFunction } from 'express'
const login = new loginClass();

router.post('/login/telemovel', async (req: Request, res: Response, next: NextFunction) => {
    let result = await login.loginPhone(
        {
            phone: req.body.telemovel
        }
    );
    return res.json(result);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    let result = await login.login(
        {
            phone: req.body.telemovel ?? '',
            password: req.body.password ?? '',
            device: req.body.dispositivo ?? '',
        }
    );
    return res.json(result);
});

export default router;
import express from 'express'
var router = express.Router()
import authClass from '../class/auth'
import { Request, Response, NextFunction } from 'express'
const auth = new authClass();

router.post('/login/email', async (req: Request, res: Response, next: NextFunction) => {
    let result = await auth.loginEmail(
        {
            email :req.body.email
        }
    );
    return res.json(result);
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    let result = await auth.login(
        {
            email: req.body.email ?? '',
            password: req.body.password ?? '',
            dispositivo: req.body.dispositivo ?? '',
        }
    );
    return res.json(result);
});

export default router;
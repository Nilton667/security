import express from 'express'
var router = express.Router();
import authClass from '../class/auth'
import { Request, Response, NextFunction } from 'express'
const auth = new authClass();

router.post('/recover/email', async (req: Request, res: Response, next: NextFunction) => {
    let result = await auth.recoverEmail(req.body.email ?? '');
    return res.json(result);
});

router.post('/recover/reenvia', async (req: Request, res: Response, next: NextFunction) => {

    let result = await auth.recoverReenviar(
        {
            nome: req.body.nome ?? '',
            email: req.body.email ?? '',
            keycode: req.body.keycode ?? '',
        }
    );
    return res.json(result);
});

router.post('/recover/token', async (req: Request, res: Response, next: NextFunction) => {
    let result = await auth.recoverToken(
        {
            token: req.body.token ?? '',
            keycode: req.body.keycode ?? '',
        }
    );
    return res.json(result);
});

router.post('/recover/update/password', async (req: Request, res: Response, next: NextFunction) => {
    let result = await auth.recoverPassword(
        {
            email: req.body.email, 
            password: req.body.password, 
            token: req.body.token, 
            keycode: req.body.keycode,
            dispositivo: req.body.dispositivo
        }
    );
    return res.json(result);
});

export default router;
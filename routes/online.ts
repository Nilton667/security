import express from 'express'
var router = express.Router();
import onlineClass from '../class/onlinePayment'
import { Request, Response, NextFunction } from 'express'
const online = new onlineClass();

router.post('/online/data', async (req: Request, res: Response, next: NextFunction) => {
    let result = await online.getData(
        {
            id: req.body.id, 
        }
    );
    return res.json(result);
});

router.post('/online/add', async (req: Request, res: Response, next: NextFunction) => {
    let result = await online.add(
        {
            id: req.body.id,
            nome: req.body.nome,
            senha: req.body.senha
        }
    );
    return res.json(result);
});

router.post('/online/delete', async (req: Request, res: Response, next: NextFunction) => {
    let result = await online.delete(
        {
            id: req.body.ref, 
        }
    );
    return res.json(result);
});

export default router;
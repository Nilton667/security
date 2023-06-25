import express from 'express';
import { Request, Response, NextFunction } from 'express';
var router = express.Router();
import carregamentoClass from '../class/carregamento'
const carregamento = new carregamentoClass();

router.post('/carregamento', async (req: Request, res: Response, next: NextFunction) => {
    let result = await carregamento.deposit(
        {
            id: req.body.id, 
            amount: req.body.amount, 
        }
    );
    return res.json(result);
});

router.post('/carregamento/paypal', async (req: Request, res: Response, next: NextFunction) => {
    let result = await carregamento.paypal();
    return res.json(result);
});

router.post('/carregamento/stripe', async (req: Request, res: Response, next: NextFunction) => {
    let result = await carregamento.stripe(
        {
            amount: req.body.amount, 
            currency: req.body.currency,
            method: req.body.method
        }
    );
    return res.json(result);
});

router.post('/carregamento/google', async (req: Request, res: Response, next: NextFunction) => {
    let result = await carregamento.google();
    return res.json(result);
});

export default router;
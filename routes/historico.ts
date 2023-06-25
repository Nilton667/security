import { Request, Response, NextFunction } from "express";
import express from 'express'
var router = express.Router();
import historicoClass from '../class/historico'
const historico = new historicoClass();

router.post('/historico/transacoes', async (req: Request, res: Response, next: NextFunction) => {
    let result = await historico.atividades(
        {
            id: req.body.id, 
            limite: req.body.limite ?? '',
        }
    );
    return res.json(result);
});

export default router;
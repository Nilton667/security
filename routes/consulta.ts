import { Request, Response, NextFunction } from "express";
import express from 'express'
var router = express.Router();
import consultaClass from '../class/consulta'
const consulta = new consultaClass();

router.post('/consulta', async (req: Request, res: Response, next: NextFunction) => {
    let result = await consulta.get(
        {
            id: req.body.id, 
            card: req.body.card ?? '',
        }
    );
    return res.json(result);
});

export default router;
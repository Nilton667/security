import express from 'express'
var router = express.Router()
import pagamentoClass from '../class/pagamentos'
import { Request, Response, NextFunction } from 'express'
const pagamento = new pagamentoClass();

router.post('/pagamento/destinatario', async (req: Request, res: Response, next: NextFunction) => {
    let result = await pagamento.destinatario(
        {
            id: req.body.id,
            destinatario: req.body.destinatario, 
        }
    );
    return res.json(result);
});

router.post('/pagamento/send', async (req: Request, res: Response, next: NextFunction) => {
    let result = await pagamento.send(
        {
            id: req.body.id,
            destinatario: req.body.destinatario,
            valor: req.body.valor,
            senha: req.body.senha, 
        }
    );
    return res.json(result);
});

export default router;
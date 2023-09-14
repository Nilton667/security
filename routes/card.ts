import express from 'express'
var router = express.Router();
import cardClass from '../class/card'
import { Request, Response, NextFunction } from 'express'
const card = new cardClass();

router.post('/card', async (req: Request, res: Response, next: NextFunction) => {
    let result = await card.getData(
        {
            id: req.body.id, 
        }
    );
    return res.json(result);
});

router.post('/card/add', async (req: Request, res: Response, next: NextFunction) => {
    let result = await card.add(
        {
            user_id: req.body.id, 
            card_number: req.body.card_number,
            expiry_date: req.body.expiry_date,
            cvv_code: 0,
            bank: req.body.bank,
            address_id: req.body.address_id, 
            name: req.body.name, 
            type: req.body.type, 
            currency: req.body.currency, 
            mnemonic: req.body.mnemonic, 
            private_key: req.body.private_key, 
            public_key: req.body.public_key, 
        }
    );
    return res.json(result);
});

router.post('/card/update', async (req: Request, res: Response, next: NextFunction) => {
    let result = await card.updateData(
        {
            id: req.body.idCard, 
            user_id: req.body.id, 
            activo: req.body.activo, 
            roubado: req.body.roubado, 
            bloqueado: req.body.bloqueado, 
        }
    );
    return res.json(result);
});

router.post('/card/set/password', async (req: Request, res: Response, next: NextFunction) => {
    let result = await card.setPassword(
        {
            id_card: req.body.id_card, 
            password: req.body.password, 
        }
    );
    return res.json(result);
});

router.post('/card/password', async (req: Request, res: Response, next: NextFunction) => {
    let result = await card.getPassword(
        {
            id_card: req.body.id_card, 
        }
    );
    return res.json(result);
});

export default router;
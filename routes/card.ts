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

export default router;
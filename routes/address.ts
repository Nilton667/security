import express from 'express'
var router = express.Router();
import addressClass from '../class/address'
import { Request, Response, NextFunction } from 'express'
const address = new addressClass();

router.post('/address', async (req: Request, res: Response, next: NextFunction) => {
    let result = await address.getData(
        {
            id: req.body.id, 
        }
    );
    return res.json(result);
});

router.post('/address/add', async (req: Request, res: Response, next: NextFunction) => {
    let result = await address.add(
        {
            user_id: req.body.id,
            name: req.body.name,
            country: req.body.country, 
            city: req.body.city, 
            line_1: req.body.line_1, 
            line_2: req.body.line_2, 
            state: req.body.state,
            zipcode: req.body.zipcode,
        }
    );
    return res.json(result);
});

router.post('/address/delete', async (req: Request, res: Response, next: NextFunction) => {
    let result = await address.delete(
        {
            id: req.body.ref, 
        }
    );
    return res.json(result);
});

export default router;
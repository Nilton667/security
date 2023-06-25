import express from 'express'
var router = express.Router()
import sessionClass from '../class/session'
import { Request, Response, NextFunction } from 'express'
const session = new sessionClass()

router.post('/session', async (req: Request, res: Response, next: NextFunction) => {
    let result = await session.getData(
        {
            id: req.body.id, 
            limite: req.body.limite ?? '',
        }
    );
    return res.json(result);
});

router.post('/session/delete', async (req: Request, res: Response, next: NextFunction) => {
    let result = await session.delete(
        {
            id: req.body.sessionId, 
        }
    );
    return res.json(result);
});

export default router;
import { Request, Response, NextFunction } from 'express';
import express from 'express';
var router = express.Router();
import feedbackClass from '../class/feedback'
const feedback = new feedbackClass();

router.post('/feedback/add', async (req: Request, res: Response, next: NextFunction) => {
    let result = await feedback.add(
        {
            id: req.body.id, 
            name: req.body.nome, 
            email: req.body.email, 
            message: req.body.mensagem
        }
    );
    return res.json(result);
});

export default router;
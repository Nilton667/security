import express from 'express';
var router = express.Router();
import { Request, Response, NextFunction } from 'express';

import authClass from '../class/auth'
const auth = new authClass();

router.post('/cadastro/email', async (req: Request, res: Response, next: NextFunction) => {
  let result = await auth.emailConfirm(
    {
      nome: req.body.nome ?? '',
      email: req.body.email ?? ''
    }
  );
  return res.json(result);
})

router.post('/cadastro/reenvia', async (req, res, next: NextFunction) => {
  let result = await auth.reenviaEmail(
    {
      nome: req.body.nome ?? '',
      email: req.body.email ?? '',
      keycode: req.body.keycode ?? '',
    }
  );
  return res.json(result);
});

router.post('/cadastro/user', async (req: Request, res: Response, next: NextFunction) => {
  let result = await auth.cadastro(
    {
      nome: req.body.nome ?? '',
      sobrenome: req.body.sobrenome ?? '',
      email: req.body.email ?? '',
      nacionalidade: req.body.nacionalidade ?? '',
      countrycode: req.body.countrycode ?? '',
      genero: req.body.genero ?? '',
      identificacao: req.body.identificacao ?? '',
      telemovel: req.body.telemovel ?? '',
      morada: req.body.morada ?? '',
      zipcode: req.body.zipcode ?? '',
      password: req.body.password ?? '',
      dispositivo: req.body.dispositivo ?? '',
    }
  );
  return res.json(result);
});

export default router;

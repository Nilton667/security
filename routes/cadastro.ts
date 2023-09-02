import express from 'express';
var router = express.Router();
import { Request, Response, NextFunction } from 'express';

import cadastroClass from '../class/cadastro'
const cadastro = new cadastroClass();

router.post('/cadastro/telemovel', async (req: Request, res: Response, next: NextFunction) => {
  let result = await cadastro.phoneConfirm(
    {
      name: req.body.nome ?? '',
      phone: req.body.telemovel ?? ''
    }
  );
  return res.json(result);
})

router.post('/cadastro/user', async (req: Request, res: Response, next: NextFunction) => {
  let result = await cadastro.cadastro(
    {
      name: req.body.nome ?? '',
      surname: req.body.sobrenome ?? '',
      email: req.body.email ?? '',
      nationality: req.body.nacionalidade ?? '',
      countrycode: req.body.countrycode ?? '',
      gender: req.body.genero ?? '',
      identification: req.body.identificacao ?? '',
      phone: req.body.telemovel ?? '',
      zipcode: req.body.zipcode ?? '',
      password: req.body.password ?? '',
      device: req.body.dispositivo ?? '',
    }
  );
  return res.json(result);
});

export default router;

import express from 'express';
var router = express.Router();
import { Request, Response, NextFunction } from 'express';

import cadastroClass from '../class/cadastro'
import upload from '../config/upload';
import ResponseModel from '../model/response.model';
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
  const uploadImage = upload.single('img');
  uploadImage(req, res, async  (error: any) => {
      if(error){
          return <ResponseModel>{
              result: {
                  success: false,
                  error: String(error),
              }
          };
      }else if(req.file){
        let result = await cadastro.cadastro(
          {
            image: req.file.filename ?? '',
            name: req.body.nome ?? '',
            surname: req.body.sobrenome ?? '',
            email: req.body.email ?? '',
            nationality: req.body.nacionalidade ?? '',
            countrycode: req.body.countrycode ?? '',
            gender: req.body.genero ?? '',
            identification: req.body.identificacao ?? '',
            phone: req.body.telemovel ?? '',
            emergency_number: req.body.emergency_number ?? '',
            zipcode: req.body.zipcode ?? '',
            password: req.body.password ?? '',
            device: req.body.dispositivo ?? '',
          }
        );
        return res.json(result);            
      }
      return <ResponseModel>{
        result: {
            success: false,
            error: 'Nenhuma imagem capturada!',
        }
    };
  })
});

export default router;

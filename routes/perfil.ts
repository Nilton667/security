import express from 'express'
var router = express.Router();
import perfilClass from '../class/perfil'
const perfil = new perfilClass();
import { Request, Response, NextFunction } from 'express'
import upload from '../config/upload';
import ResponseModel from '../model/response.model';

router.post('/perfil/user', async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.userData(
        {
            id: req.body.id, 
        }
    );
    return res.json(result);
});

router.post('/perfil/update/password', upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.recoverPasswordPerfil(
        {
            id: req.body.id,
            oldSenha: req.body.oldSenha, 
            senha: req.body.senha,
        }
    );
    return res.json(result);
});

router.post('/perfil/upload/image', async (req: Request, res: Response, next: NextFunction) => {
    var id = req.body.id;
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
            var result = await perfil.uploadImage(
                {
                    id: id,
                    imagem: req.file.filename,
                }
            );
            return res.json(result);            
        }
        return res.json(0);
    })
});

export default router;
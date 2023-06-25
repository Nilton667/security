import express from 'express'
var router = express.Router();
import perfilClass from '../class/perfil'
const perfil = new perfilClass();
import { Request, Response, NextFunction } from 'express'
import upload from '../config/upload';

router.post('/perfil/user', async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.userData(
        {
            id: req.body.id, 
        }
    );
    return res.json(result);
});

router.post('/perfil/update', async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.userUpdate(
        {
            id: req.body.id,
            morada: req.body.morada, 
        }
    );
    return res.json(result);
});

router.post('/perfil/permision/update', async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.serPermision(
        {
            id: req.body.id, 
            email: req.body.email, 
            sms: req.body.sms, 
            online: req.body.online, 
        }
    );
    return res.json(result);
});

router.post('/perfil/update/password', upload.single('img'), async (req: Request, res: Response, next: NextFunction) => {
    let result = await perfil.recoverPasswordPerfil(
        {
            id: req.body.id,
            email: req.body.email,
            oldSenha: req.body.oldSenha, 
            senha: req.body.senha,
            dispositivo: req.body.dispositivo 
        }
    );
    return res.json(result);
});

router.post('/perfil/upload/image', async (req: Request, res: Response, next: NextFunction) => {
    var id = req.body.id;
    const uploadImage = upload.single('img');
    uploadImage(req, res, async  (error: any) => {
        if(error){
            return res.json(error);
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
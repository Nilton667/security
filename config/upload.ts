import path from 'path'
import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

export default (multer(
    {
        storage: multer.diskStorage({
            destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
              cb(null, './public/img/perfil');
            },
            filename: (req, file: Express.Multer.File, cb: FileNameCallback) => {
              cb(null, Date.now().toString()+path.extname(file.originalname))
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback)=>{
            const permite = ['.png', '.jpg', '.jpeg'].find(formato => formato == path.extname(file.originalname.toLowerCase()));
            if(permite == undefined){
                return cb(null, false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: (1024 * 1024) * 2
        },
    })
);
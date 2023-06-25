import 'dotenv/config'
import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import nodemail from '../config/nodemail';
import jwt from 'jsonwebtoken';
import JwtPayload from '../model/jwtPayload';
import userData from '../model/userData';
import UserData from '../model/userData';

export default class Auth{

    async loginEmail({email}:{email: string}){
        try {
            var select = await sequelize.query('SELECT id from usuarios WHERE email = :email',
                {
                    replacements: {email: email},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return select;
            }
            return 0;
        } catch (error) {
            return error;
        }
    }

    async login({email, password, dispositivo}:{email: string, password: string, dispositivo: string}){
        try {
            var select: Array<userData> = await sequelize.query('SELECT * from usuarios WHERE email = :email',
                {
                    replacements: {email: email},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                if(bcrypt.compareSync(password, select[0].password!)){
                    const token = jwt.sign({id: select[0].id}, process.env.PRIVATE_KEY as string, { expiresIn: '24h'});
                    return await this.saveLogin({id: select[0].id, token: token, tempo: 1, dispositivo: dispositivo, userData: select});
                }
            }
            return 0;
        } catch (error) {
          return error;
        } 
    }

    async saveLogin(
        {id, token, tempo, dispositivo, userData}
        : {id?: number, token: string, tempo: number, dispositivo: string, userData: Array<UserData>}
    ) //Salvar registo do login
    {
        try {  
            var insert = await sequelize.query('INSERT INTO acesso (id_usuario, token, tempo, dispositivo) VALUES (:id, :token, :tempo, :dispositivo)',
            {
                replacements: {
                    id: id, 
                    token: token,
                    tempo: tempo, 
                    dispositivo: dispositivo, 
                },
                type: QueryTypes.INSERT
            }); 
            if(insert.length > 0 && insert[1] == 1){
                return [userData[0], {token: token}];
            }
            return 0;   
        } catch (error) {
            return error;
        }
    }

    async emailConfirm ({nome, email}:{nome: string, email: string}) {
        try {
            var select = await sequelize.query('SELECT id from usuarios WHERE email = :email',
                {
                    replacements: {email: email},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return 2;
            }else{

                let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                
                try {
                    await nodemail.sendMail({
                        from: '"Horizon" <geral@construvision.com>',
                        to: email,
                        subject: "HorizonPay",
                        text: 'Olá Sr(a) '+nome+', este é o seu código de verificação Horizon '+keycode+'.',
                    });
                } catch (error) {
                    return 'mail-error';
                }

                return [1, keycode];
            }
            
        } catch (error) {
          return error;
        }  
    }

    //Reenviar email de confirmação
    async reenviaEmail({nome, email, keycode}:{nome: string, email: string, keycode: string}){
        try {
            await nodemail.sendMail({
                from: '"Horizon" <geral@construvision.com>',
                to: email,
                subject: "HorizonPay",
                text: 'Olá Sr(a) '+nome+', este é o seu código de verificação Horizon '+keycode+'.',
            });
        } catch (error) {
            return 'mail-error';
        }
        return 1;
    }

    async cadastro(
        {nome, sobrenome, email, nacionalidade, countrycode, genero, identificacao, telemovel, morada, zipcode, password, dispositivo}
        : {nome: string, sobrenome: string, email: string, nacionalidade: string, countrycode: number, genero: string, identificacao: string, telemovel: string, morada: string, zipcode: string, password: string, dispositivo: string}
        ){

        try {
            var select = await sequelize.query('SELECT id from usuarios WHERE email = :email',
                {
                    replacements: {email: email},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return 2;
            }else{
                //Gerando Hash
                const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
                const hash = bcrypt.hashSync(password, salt);

                var insert = await sequelize.query('INSERT INTO usuarios (nome, sobrenome, email, nacionalidade, countrycode, genero, identificacao, telemovel, morada, zipcode, password) VALUES (:nome, :sobrenome, :email, :nacionalidade, :countrycode, :genero, :identificacao, :telemovel, :morada, :zipcode, :password)',
                    {
                        replacements: {
                            nome: nome, 
                            sobrenome: sobrenome, 
                            email: email, 
                            nacionalidade: nacionalidade, 
                            countrycode: countrycode, 
                            genero: genero, 
                            identificacao: identificacao, 
                            telemovel: telemovel, 
                            morada: morada, 
                            zipcode: zipcode, 
                            password: hash,
                        },
                        type: QueryTypes.INSERT
                    }
                );
                
                if(insert.length > 0 && insert[1] == 1){
                    return await this.login({email: email, password: password, dispositivo: dispositivo});
                }
                return 0;
            }
        } catch (error) {
            return error;
        }
    }

    /*cardGenerator(){
        const date = new Date();
        const card0 = '6'+Math.ceil(Math.random() * (999 - 100) + 100);  
        const card1 = date.getFullYear().toString().substring(2)+(date.getMonth()+1).toString().padStart(2, '0');
        const card2 = date.getDate().toString().padStart(2, '0')+date.getHours().toString().padStart(2, '0');
        const card3 = date.getMinutes().toString().padStart(2, '0')+date.getSeconds().toString().padStart(2, '0');
        return card0+card1+card2+card3;
    }*/

    async recoverEmail(email: string){
        try {
            var select: Array<UserData> = await sequelize.query('SELECT id, nome FROM usuarios WHERE email = :email',
                {
                    replacements: {email: email},
                    type: QueryTypes.SELECT
                }
            );
            if(select.length > 0){

                let keycode = Math.ceil(Math.random() * (999999 - 100000) + 100000);
                const token = jwt.sign({id: select[0].id, keycode: keycode}, process.env.PRIVATE_KEY as string, {expiresIn: '1d'});
                
                try {
                    await nodemail.sendMail({
                        from: '"Horizon" <geral@construvision.com>',
                        to: email,
                        subject: "HorizonPay",
                        text: 'Olá Sr(a) '+select[0].nome+', este é o seu código de recuperação Horizon '+keycode+'.',
                    });
                } catch (error) {
                    return 'mail-error';
                }
                return [select[0], {keycode: keycode, token: token}]
            }   
            return 0;
        } catch (error) {
            return error;
        }
    }

    async recoverReenviar({nome, email, keycode}:{nome: string, email: string, keycode: string}){
        try {
            await nodemail.sendMail({
                from: '"Horizon" <geral@construvision.com>',
                to: email,
                subject: "HorizonPay",
                text: 'Olá Sr(a) '+nome+', este é o seu código de recuperação Horizon '+keycode+'.',
            });
        } catch (error) {
            return 'mail-error';
        }
        return 1;
    }

    async recoverToken({token, keycode}:{token: string, keycode: string}){
        try {
            var decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as JwtPayload;
            if(decoded.keycode == keycode){
                return 1;
            }
            return 0;
        } catch (error) {
            return 'token-error';
        }
    }

    async recoverPassword(
        {email, password, token, keycode, dispositivo}
        : 
        {email: string, password: string, token: string, keycode: string, dispositivo: string}
    ){
        //Gerando Hash
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT as string));
        const hash = bcrypt.hashSync(password, salt);

        try {
            var decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as JwtPayload;
            if(decoded.keycode == keycode){
                var update = await sequelize.query('UPDATE usuarios SET password = :password WHERE email = :email AND id = :id',
                    {
                        replacements: {
                            id: decoded.id,
                            email: email, 
                            password: hash
                        },
                        type: QueryTypes.UPDATE
                    }
                );
            
                if(update.length > 0 && update[1] == 1){
                    return await this.login({email: email, password: password, dispositivo: dispositivo});
                }
            }
            return 0;
        } catch (error) {
            return 'token-error';
        }
    }

}
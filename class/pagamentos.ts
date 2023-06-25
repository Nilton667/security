import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import Perfil from './perfil';
import bcrypt from 'bcrypt';
import UserData from '../model/userData';

export default class Pagamento extends Perfil{
    async destinatario({id, destinatario}:{id: number, destinatario: string}) : Promise<[] | UserData[]> { 
        try {
            
            var query = "SELECT * FROM usuarios WHERE email = :destinatario AND id != :id OR cartao = :destinatario AND id != :id LIMIT 1";

            var select: Array<UserData> = await sequelize.query(query,
                {
                    replacements: {id: id, destinatario: destinatario},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return select;
            }
            return [];
        } catch (error) {
            console.log(error)
            return [];
        }
    }

    async send({id, destinatario, valor, senha}:{id: number, destinatario: string, valor: string, senha: string}){
        var _valor: number = parseFloat(valor);
       
        if(typeof _valor != 'number'){
            return 'invalid_format';
        }else if(_valor >= 100000.00){
            return 'maximum_limit';
        }

        var _destinatario = await this.destinatario({id, destinatario});
        if(_destinatario.length > 0){

            var remetente = await this.userData({id: id});
            if(remetente.length > 0){

                if(remetente[0].password && bcrypt.compareSync(senha, remetente[0].password)){
                    if(remetente[0].saldo! > valor){

                        var debito  = await sequelize.query('UPDATE usuarios SET saldo = :saldo WHERE id = :id',
                            {
                                replacements: {id: id, saldo: (parseFloat(remetente[0].saldo!) - _valor).toFixed(2)},
                                type: QueryTypes.UPDATE
                            }
                        ); 
        
                        if(debito.length > 0 && debito[1] == 1){
                            var credito = await sequelize.query('UPDATE usuarios SET saldo = :saldo WHERE email = :destinatario AND id != :id OR cartao = :destinatario AND id != :id',
                                {
                                    replacements: {id: id, destinatario: destinatario, saldo: (parseFloat(_destinatario[0].saldo!) + _valor).toFixed(2)},
                                    type: QueryTypes.UPDATE
                                }
                            );
                            
                            if(credito.length > 0 && credito[1] == 1){

                                return [{'status': 'success', 'balance': (parseFloat(remetente[0].saldo!) - _valor).toFixed(2)}];
                                
                            }else{
                                return 5; // não foi possivel creditar o destinatario
                            }
        
                        }else{
                            return 4; // não foi possivel debitar o remitente
                        }
    
                    }else{
                        return 3; // saldo insuficiente
                    }

                }else{
                    return 2; //password errada
                }

            }else{
                return 1; // remitente não encontrado
            }

        }else{
            return 0; // destinatario não encontrado
        }

    }
}
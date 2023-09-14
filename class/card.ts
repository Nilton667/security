import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import CardModel from './../model/card.model';
import ResponseModel from '../model/response.model';

export default class Online{
    async getData({id} : CardModel) : Promise<ResponseModel>{
        try {
            
            var query = "SELECT * from card WHERE user_id = :id ORDER BY id DESC LIMIT 10";
        
            var select: Array<CardModel> = await sequelize.query(query,
                {
                    replacements: {id: id},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: select,
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Nenhum resultado encontrado!',
                }
            };
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }

    async add({user_id, bank, card_number, cvv_code, expiry_date, address_id, name, type, currency, mnemonic, private_key, public_key} : CardModel) : Promise<ResponseModel>{

        var select = await sequelize.query('SELECT id from card WHERE user_id = :id',
            {
                replacements: {id: user_id},
                type: QueryTypes.SELECT
            }
        );

        if(select.length <= 5){
            try {      
                var insert = await sequelize.query("INSERT INTO card (user_id, bank, address_id, name, type, card_number, cvv_code, expiry_date, currency) VALUES (:user_id, :bank, :address_id, :name, :type, :card_number, :cvv_code, :expiry_date, :currency)",
                {
                    replacements: {
                        user_id: user_id, 
                        bank: bank,
                        address_id: address_id,
                        name: name, 
                        type: type, 
                        card_number: card_number, 
                        cvv_code: cvv_code,
                        expiry_date: expiry_date,
                        currency: currency,  
                    },
                    type: QueryTypes.INSERT
                }
            );
                
                if(insert.length > 0 && insert[1] == 1){
                    return <ResponseModel>{
                        result: {
                            success: true,
                            data: 'O seu cartão foi registado com sucesso!',
                        }
                    };
                }
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: 'Não foi possível registar o seu cartão!',
                    }
                };
            } catch (error: any) {
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: error.message,
                    }
                };
            }
        }else{
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Limite de cartões excedido!',
                }
            };
        }
    }

    async updateData(
        {id, user_id, activo, roubado, bloqueado} 
        : 
        {id: number, user_id: number, activo: number, roubado: number, bloqueado: number}) : Promise<ResponseModel>{
        try {
            
            var query = "UPDATE card SET activo = :activo, roubado = :roubado, bloqueado = :bloqueado WHERE id = :id";
        
            var update = await sequelize.query(query,
                {
                    replacements: {
                        id: id,
                        activo: activo,
                        roubado: roubado,
                        bloqueado: bloqueado,
                    },
                    type: QueryTypes.UPDATE
                }
            );

            if(update.length > 0 && update[1] == 1){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: update,
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível actualizar o seu cartão!',
                }
            };
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }

    async getPassword({id_card} : {id_card: number}){
        try {
            
            var query = "SELECT * FROM password WHERE id_card = :id_card ORDER BY id DESC Limit 1";
        
            var select = await sequelize.query(query,
                {
                    replacements: {
                        id_card: id_card,
                    },
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: select[0],
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Nenhuma senha activa!',
                }
            };
        } catch (error: any) {
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }

    async setPassword({id_card, password}:{id_card: number, password: number}){
        try {

            var time = Date.now();
            
            var query = "INSERT INTO password (id_card, time, password) VALUES (:id_card, :time, :password)";
        
            var insert = await sequelize.query(query,
                {
                    replacements: {
                        id_card: id_card,
                        password: password,
                        time: time,
                    },
                    type: QueryTypes.INSERT
                }
            );

            if(insert.length > 0 && insert[1] == 1){
                return <ResponseModel>{
                    result: {
                        success: true,
                        data: insert,
                    }
                };
            }
            return <ResponseModel>{
                result: {
                    success: false,
                    error: 'Não foi possível registar a senha!',
                }
            };
        } catch (error: any) {
            console.log(error.message)
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }
}
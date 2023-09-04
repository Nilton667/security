import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import ResponseModel from '../model/response.model';
import sendSms from '../config/sendSms';

export default class Consulta{
    async get({id, card} : {id: number, card: number}){
        try {
                        
            var query = "SELECT bank, card_number, expiry_date, currency, card.activo, card.roubado, card.bloqueado, card.name, image, gender, phone FROM card LEFT JOIN users ON card.user_id = users.id WHERE card.card_number = :card_number LIMIT 1";
        
            var select = await sequelize.query(query,
                {
                    replacements: {card_number: card},
                    type: QueryTypes.SELECT
                }
            );

            if(select.length > 0){
                var data: any = select[0];

                await sequelize.query("INSERT INTO historic (user_id, card, nome) VALUES (:user_id, :card, :nome)",
                {
                    replacements: {
                        user_id: id, 
                        card: card, 
                        nome: data.name, 
                    },
                    type: QueryTypes.INSERT
                });

                if(data.roubado == 1){
                new sendSms().send(
                    {
                        phone: data.phone,
                        message: 'Tentativa de uso do seu cartão Multicaixa número '+data.card_number+', que foi declarado como roubado, Por favor tome as medidas necessárias para investigar esse incidente imediatamente e garantir a segurança das suas finanças.',
                    }
                );
                }else if(data.bloqueado == 1){
                    new sendSms().send(
                        {
                            phone: data.phone,
                            message: 'Tentativa de uso do seu cartão Multicaixa número '+data.card_number+', que foi bloqueado, Por favor tome as devidas providências para investigar essa situação e garantir a segurança do seu familiar.',
                        }
                    );
                }

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
                    error: 'Nenhum resultado encontrado!',
                }
            };
        } catch (error: any) {
            console.log(error);
            return <ResponseModel>{
                result: {
                    success: false,
                    error: error.message,
                }
            };
        }
    }
}
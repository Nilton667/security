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

    async add({user_id, address_id, name, type, currency, mnemonic, private_key, public_key} : CardModel) : Promise<ResponseModel>{

        var select = await sequelize.query('SELECT id from card WHERE user_id = :id',
            {
                replacements: {id: user_id},
                type: QueryTypes.SELECT
            }
        );

        if(select.length <= 5){
            try {
                switch (currency) {
                    case 'eth':           
                        var insert = await sequelize.query("INSERT INTO card (user_id, address_id, name, type, currency, mnemonic, private_key, public_key) VALUES (:user_id, :address_id, :name, :type, :currency, :mnemonic, :private_key, :public_key)",
                            {
                                replacements: {
                                    user_id: user_id, 
                                    address_id: address_id,
                                    name: name, 
                                    type: type,  
                                    currency: currency, 
                                    mnemonic: mnemonic, 
                                    private_key: private_key, 
                                    public_key: public_key, 
                                },
                                type: QueryTypes.INSERT
                            }
                        );
                    break;
                    default:
                        
                        const date: Date        = new Date();
                        var card_number: number = this.getCardNumer(date);
                        var cvv_code:    String = this.getRandomArbitrary(100, 999);
                        var expiry_date: String = `${this.getRandomArbitrary(1, 25).padStart(2, '0')}/${(parseInt(date.getFullYear().toString().toString().substring(date.getFullYear().toString().length - 2)) + 5)}`;

                        var insert = await sequelize.query("INSERT INTO card (user_id, address_id, name, type, card_number, cvv_code, expiry_date, currency) VALUES (:user_id, :address_id, :name, :type, :card_number, :cvv_code, :expiry_date, :currency)",
                        {
                            replacements: {
                                user_id: user_id, 
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
                    break;
                }
                
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
    
    getRandomArbitrary(min: number, max: number) : string {
        return (Math.floor(Math.random() * (max - min) + min)).toString();
    }
    
    getCardNumer(date: Date) : number {
        const day: String    = date.getDate().toString().padStart(2, '0');
        const month: String  = (date.getMonth() + 1).toString().padStart(2, '0');
        const year: String   = date.getFullYear().toString().substring(date.getFullYear().toString().length - 2);
        const hour: String   = date.getHours().toString().padStart(2, '0');
        const minute: String = date.getMinutes().toString().padStart(2, '0');
        const second: String = date.getSeconds().toString().padStart(2, '0');
        const rand = this.getRandomArbitrary(100, 999);
 
        var number: string = `6${day}${month}${year}${hour}${minute}${second}${rand}`;
        console.log(number)
        return parseInt(number);
    }
}
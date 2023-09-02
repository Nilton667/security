import sequelize from '../config/db';
import { QueryTypes } from 'sequelize';
import AddressModel from './../model/address.model';
import ResponseModel from '../model/response.model';

export default class address{
    async getData({id} : AddressModel) : Promise<ResponseModel>{
        try {
            
            var query = "SELECT * from address WHERE user_id = :id ORDER BY id DESC LIMIT 10";
        
            var select: Array<AddressModel> = await sequelize.query(query,
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

    async add({user_id, name, country, city, line_1, line_2, state, zipcode} : AddressModel) : Promise<ResponseModel>{

        var select = await sequelize.query('SELECT id from address WHERE user_id = :id',
            {
                replacements: {id: user_id},
                type: QueryTypes.SELECT
            }
        );

        if(select.length <= 5){
            try {
                
                var query = "INSERT INTO address (`user_id`, `name`, `country`, `city`, `line_1`, `line_2`, `state`, `zipcode`) VALUES (:user_id, :name, :country, :city, :line_1, :line_2, :state, :zipcode)";
            
                var insert = await sequelize.query(query,
                    {
                        replacements: {
                            user_id: user_id,
                            name: name,	
                            country: country,
                            city: city,	
                            line_1: line_1,
                            line_2: line_2,	
                            state: state,
                            zipcode: zipcode,	
                        },
                        type: QueryTypes.INSERT
                    }
                );
    
                if(insert.length > 0 && insert[1] == 1){
                    return <ResponseModel>{
                        result: {
                            success: true,
                            data: 'O seu endereço foi registado com sucesso!',
                        }
                    };
                }
                return <ResponseModel>{
                    result: {
                        success: false,
                        error: 'Não foi possível registar o seu endereço!',
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
                    error: 'Limite de endereços excedido!',
                }
            };
        }
    }

    async delete({id}: AddressModel) : Promise<ResponseModel>{
        try {
            var query = "DELETE FROM address WHERE id = :id";
            await sequelize.query(query,
                {
                    replacements: {id: id},
                    type: QueryTypes.DELETE
                }
            );
            return <ResponseModel>{
                result: {
                    success: true,
                    error: 'Endereço eliminado com sucesso!',
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
}
import axios from 'axios';

export default class sendSms{
    async send({phone, message} : {phone: String, message: String}){
        axios({
            method: 'post',
            url: 'http://52.30.114.86:8080/mimosms/v1/message/send?token=40c1daee42b0c6c236b3144492001840926014578',
            data: {
                sender: 'Security',
                recipients: phone,
                text: message,
            }
        });
    }
}
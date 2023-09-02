import UserData from './userData.model'

export default interface LoginModel {
    id?: number, 
    time?: number,
    token?: string,
    email?: string,
    phone?: string, 
    keycode?: string,
    password?: string,  
    device?: string, 
    userData?: Array<UserData>
}
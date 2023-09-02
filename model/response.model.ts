export default interface ResponseModel {
    result?: {
        success?: boolean,
        error?: string,
        status?: number,
        data?: Array<any>|string|Object,
    }
}
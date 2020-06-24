import { AxiosError } from 'axios';

export class ServiceError extends Error {
    public static fromAxiosError(error: AxiosError): ServiceError {
        const serviceError = new ServiceError();

        if (error.response) {
            serviceError.status = error.response.status;
            serviceError.message = error.response.data.error;
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
        } else {
            // Something happened in setting up the request that triggered an Error
        }

        return serviceError;
    }
    public status: number = 0;
    public errorMessage: string = '';
}

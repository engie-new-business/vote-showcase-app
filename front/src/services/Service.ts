import axios from 'axios';
import { ServiceError } from './ServiceError';
import config from '@/config';

export default function createHTTP(url, apikey) {
  const instance = axios.create({
    baseURL: url,
    headers: {
      'Content-Type': 'application/json',
    },
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          return data;
        } else {
          return JSON.stringify(data);
        }
      },
    ],
  });

  instance.defaults.headers.common.apikey = apikey;

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(ServiceError.fromAxiosError(error));
    },
  );

  return instance;
}

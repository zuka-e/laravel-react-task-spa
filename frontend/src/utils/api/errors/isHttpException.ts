import axios, { AxiosError, AxiosResponse } from 'axios';

interface HttpException extends AxiosError {
  response: AxiosResponse<{
    message: string;
  }>;
}

export const isHttpException = (payload: any): payload is HttpException =>
  axios.isAxiosError(payload) &&
  typeof payload.response?.data?.message === 'string';

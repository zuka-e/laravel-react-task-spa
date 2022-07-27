import axios, { AxiosError, AxiosResponse } from 'axios';

export interface HttpException extends AxiosError {
  response: AxiosResponse<{
    message: string;
  }>;
}

export const isHttpException = (payload: unknown): payload is HttpException =>
  axios.isAxiosError(payload) &&
  typeof payload.response?.data?.message === 'string';

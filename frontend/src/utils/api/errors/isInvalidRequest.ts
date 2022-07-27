import axios, { AxiosError, AxiosResponse } from 'axios';

export interface InvalidRequest extends AxiosError {
  response: AxiosResponse<{
    message: string;
    errors: { [source: string]: string[] };
  }>;
}

export const isInvalidRequest = (payload: unknown): payload is InvalidRequest =>
  axios.isAxiosError(payload) &&
  payload.response?.status === 422 &&
  typeof payload.response?.data?.errors === 'object';

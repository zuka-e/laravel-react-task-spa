import { HttpException, InvalidRequest } from 'utils/api/errors';

export type ErrorResponse = {
  message?: HttpException['response']['data']['message'];
  errors?: InvalidRequest['response']['data']['errors'];
};

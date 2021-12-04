import {
  isHttpException,
  isInvalidRequest,
  makeErrorMessageFrom,
} from 'utils/api/errors';
import { RejectValue } from 'store/thunks/config';

export const makeRejectValue = (error: unknown): RejectValue => {
  if (isInvalidRequest(error))
    return {
      error: {
        ...error,
        message: makeErrorMessageFrom(error),
      },
    };
  if (isHttpException(error))
    return {
      error: {
        ...error,
        message: `${error.response.status}: ${error.response.data.message}`,
      },
    };
  return {
    error: { message: String(error) },
  };
};

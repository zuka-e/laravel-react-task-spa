import { InvalidRequest } from '.';

export const makeErrorMessageFrom = (error: InvalidRequest) => {
  const concatenateErrorsWithLineBreaks = (message: string, errors: string[]) =>
    message + errors.join('\n') + '\n';

  return Object.values(error.response.data.errors).reduce(
    concatenateErrorsWithLineBreaks,
    ''
  );
};

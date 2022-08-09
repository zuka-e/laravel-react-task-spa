import { compose, context, RestRequest } from 'msw';

import type { User } from 'models/User';
import type { ErrorResponse } from 'mocks/api/handlers/types';
import { auth } from 'mocks/models';
import {
  X_XSRF_TOKEN,
  hasValidToken,
  getUserFromSession,
} from 'mocks/utils/validation';

type Middleware =
  | 'authenticate'
  | 'authorize'
  | `authorize:${User['id']}`
  | 'verified';

export const applyMiddleware = (
  request: RestRequest,
  middleware?: Middleware[]
) => {
  const token = request.headers.get(X_XSRF_TOKEN);
  const currentUser = getUserFromSession(request.cookies.session_id);

  if (middleware?.includes('authenticate') && !currentUser)
    return compose(
      context.status(401),
      context.json<ErrorResponse>({ message: 'Unauthenticated.' })
    );

  if (middleware?.includes('verified') && !currentUser?.emailVerifiedAt)
    return compose(
      context.status(403),
      context.json<ErrorResponse>({ message: 'Email address is not verified.' })
    );

  if (middleware?.includes('authorize'))
    throw new Error('Specify the user ID. e.g. "authorize:xxx"');

  const authorizationPattern = /(?<=authorize:)[\w-]+(?=,|$)/;
  const authorizationMatch = middleware?.find((middleware) =>
    middleware.match(authorizationPattern)
  );

  if (authorizationMatch) {
    const userIds = authorizationMatch.slice('authorize:'.length).split(',');
    const uniqueUserIds = [...new Set(userIds)]; // "downlevelIteration"

    if (uniqueUserIds.includes('undefined'))
      return compose(
        context.status(404),
        context.json<ErrorResponse>({ message: 'The URL was not found.' })
      );
    if (uniqueUserIds.length !== 1 || uniqueUserIds[0] !== currentUser?.id)
      return compose(
        context.status(403),
        context.json<ErrorResponse>({ message: 'This action is unauthorized.' })
      );
  }

  // Global Middleware
  if (!token || !hasValidToken(token))
    return compose(
      context.status(419),
      context.json<ErrorResponse>({ message: 'Token mismatch.' })
    );

  if (currentUser) {
    auth.login(currentUser);
  }
};

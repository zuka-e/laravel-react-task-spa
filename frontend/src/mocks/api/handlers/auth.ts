import { DefaultRequestBody, RequestParams } from 'msw';
import { rest } from 'msw';

import type {
  SignUpRequest,
  SignUpResponse,
  FetchAuthUserResponse,
  SignInRequest,
  SignInResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdatePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from 'store/thunks/auth';
import type { ErrorResponse } from './types';
import { auth, db, sanitizeUser } from 'mocks/models';
import {
  createUserController,
  deleteAccountController,
  resetPasswordController,
  updatePasswordController,
  updateProfileController,
} from 'mocks/controllers';
import { url } from 'mocks/utils/route';
import {
  XSRF_TOKEN,
  isUniqueEmail,
  authenticate,
  isValidPassword,
  regenerateSessionId,
  createSessionId,
  generateCsrfToken,
  isValidPasswordResetToken,
} from 'mocks/utils/validation';
import { applyMiddleware, returnInvalidRequest } from './utils';

export const handlers = [
  rest.post<SignUpRequest, SignUpResponse & ErrorResponse, RequestParams>(
    url('SIGNUP_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req);
      if (httpException) return res(httpException);

      if (!isUniqueEmail(req.body.email))
        return res(
          returnInvalidRequest({
            email: ['このメールアドレスは既に使用されています。'],
          })
        );

      const response = createUserController.store(req.body);
      const encryptedSessionId = createSessionId(response.user.id);

      return res(
        ctx.status(201),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(response)
      );
    }
  ),

  rest.get<DefaultRequestBody, undefined, RequestParams>(
    url('GET_CSRF_TOKEN_PATH'),
    (_req, res, ctx) => {
      const csrfToken = generateCsrfToken();
      return res(ctx.cookie(XSRF_TOKEN, csrfToken));
    }
  ),

  rest.get<
    DefaultRequestBody,
    FetchAuthUserResponse & ErrorResponse,
    RequestParams
  >(url('USER_INFO_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;

    return res(
      ctx.status(200),
      ctx.json({
        user: sanitizeUser(currentUser),
      })
    );
  }),

  rest.post<
    DefaultRequestBody,
    FetchAuthUserResponse & ErrorResponse,
    RequestParams
  >(url('VERIFICATION_NOTIFICATION_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;

    return res(ctx.status(currentUser.emailVerifiedAt ? 204 : 202));
  }),

  rest.post<SignInRequest, SignInResponse & ErrorResponse, RequestParams>(
    url('SIGNIN_PATH'),
    (req, res, ctx) => {
      const user = authenticate(req.body);

      if (!user)
        return res(returnInvalidRequest({ email: ['認証に失敗しました。'] }));

      return res(
        ctx.status(200),
        ctx.cookie('session_id', createSessionId(user.id), { httpOnly: true }),
        ctx.json({ user: sanitizeUser(user) })
      );
    }
  ),

  rest.put<
    UpdateProfileRequest,
    UpdateProfileResponse & ErrorResponse,
    RequestParams
  >(url('USER_INFO_PATH'), (req, res, ctx) => {
    const httpException = applyMiddleware(req, ['authenticate']);
    if (httpException) return res(httpException);

    if (!isUniqueEmail(req.body.email))
      return res(
        returnInvalidRequest({
          email: ['このメールアドレスは既に使用されています。'],
        })
      );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentUser = auth.getUser()!;
    const newSessionId = regenerateSessionId(req.cookies.session_id);
    const response = updateProfileController.update({
      currentUser: currentUser,
      request: req.body,
    });

    return res(
      ctx.status(200),
      ctx.cookie('session_id', newSessionId, { httpOnly: true }),
      ctx.json(response)
    );
  }),

  rest.put<UpdatePasswordRequest, void & ErrorResponse, RequestParams>(
    url('UPDATE_PASSWORD_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, ['authenticate']);
      if (httpException) return res(httpException);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentUser = auth.getUser()!;

      if (!isValidPassword(req.body.current_password, currentUser.password))
        return res(
          returnInvalidRequest({
            password: ['パスワードが間違っています。'],
          })
        );

      updatePasswordController.update({
        currentUser: currentUser,
        request: req.body,
      });

      const newSessionId = regenerateSessionId(req.cookies.session_id);

      return res(
        ctx.status(200),
        ctx.cookie('session_id', newSessionId, { httpOnly: true })
      );
    }
  ),

  rest.post<ForgotPasswordRequest, void & ErrorResponse, RequestParams>(
    url('FORGOT_PASSWORD_PATH'),
    (req, res, ctx) => {
      const requestedUser = db.where('users', 'email', req.body.email)[0];

      if (!requestedUser)
        return res(
          returnInvalidRequest({
            email: ['指定されたメールアドレスは存在しません。'],
          })
        );

      return res(ctx.status(200));
    }
  ),

  rest.post<ResetPasswordRequest, void & ErrorResponse, RequestParams>(
    url('RESET_PASSWORD_PATH'),
    (req, res, ctx) => {
      if (!isValidPasswordResetToken(req.body))
        return res(returnInvalidRequest({ email: ['認証に失敗しました。'] }));

      resetPasswordController.reset(req.body);

      return res(
        ctx.status(200),
        ctx.cookie('session_id', regenerateSessionId(req.cookies.session_id), {
          httpOnly: true,
        })
      );
    }
  ),

  rest.post<DefaultRequestBody, void & ErrorResponse, RequestParams>(
    url('SIGNOUT_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, ['authenticate']);
      if (httpException) return res(httpException);

      auth.logout();

      return res(
        ctx.status(204),
        ctx.cookie('session_id', '', { httpOnly: true })
      );
    }
  ),

  rest.delete<DefaultRequestBody, void & ErrorResponse, RequestParams>(
    url('SIGNUP_PATH'),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, ['authenticate']);
      if (httpException) return res(httpException);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentUser = auth.getUser()!;

      deleteAccountController.remove(currentUser);

      return res(
        ctx.status(204),
        ctx.cookie('session_id', '', { httpOnly: true })
      );
    }
  ),
];

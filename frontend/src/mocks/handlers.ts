import { DefaultRequestBody, RequestParams, rest } from 'msw';

import {
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
} from 'store/thunks';
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
  X_XSRF_TOKEN,
  hasValidToken,
  isUniqueEmail,
  authenticate,
  isValidPassword,
  getUserFromSession,
  regenerateSessionId,
  createSessionId,
  generateCsrfToken,
  isValidPasswordResetToken,
} from 'mocks/utils/validation';

import 'mocks/data';

// HTTPメソッドとリクエストパス(第一引数)を指定し、`Request handler`を生成
// リクエストに対応するレスポンスのモックを`Response resolver`により作成

export const handlers = [
  rest.post<SignUpRequest, SignUpResponse, RequestParams>(
    url('SIGNUP_PATH'),
    (req, res, ctx) => {
      const token = req.headers.get(X_XSRF_TOKEN);
      const { email } = req.body;

      // token mismatch error
      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      // validation error
      if (!isUniqueEmail(email)) return res(ctx.status(422));

      const response = createUserController.store(req.body);
      const encryptedSessionId = createSessionId(response.user.id);

      return res(
        ctx.status(201),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(response)
      );
    }
  ),

  rest.get(url('GET_CSRF_TOKEN_PATH'), (_req, res, ctx) => {
    const csrfToken = generateCsrfToken();
    return res(ctx.cookie(XSRF_TOKEN, csrfToken));
  }),

  rest.get<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    url('AUTH_USER_PATH'),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      auth.login(currentUser);

      const response: FetchAuthUserResponse = {
        user: sanitizeUser(currentUser),
      };

      return res(ctx.status(200), ctx.json(response));
    }
  ),

  rest.post<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    url('VERIFICATION_NOTIFICATION_PATH'),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const statusCode = currentUser.emailVerifiedAt ? 204 : 202;

      return res(ctx.status(statusCode));
    }
  ),

  rest.post<SignInRequest, SignInResponse, RequestParams>(
    url('SIGNIN_PATH'),
    (req, res, ctx) => {
      const user = authenticate(req.body);

      if (!user) return res(ctx.status(422));

      const encryptedSessionId = createSessionId(user.id);
      const response: SignInResponse = { user: sanitizeUser(user) };

      return res(
        ctx.status(200),
        ctx.cookie('session_id', encryptedSessionId, { httpOnly: true }),
        ctx.json(response)
      );
    }
  ),

  rest.put<UpdateProfileRequest, UpdateProfileResponse, RequestParams>(
    url('UPDATE_USER_INFO_PATH'),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!isUniqueEmail(req.body.email)) return res(ctx.status(422));

      const newSessionId = regenerateSessionId(req.cookies.session_id);
      const response = updateProfileController.update({
        currentUser,
        request: req.body,
      });

      return res(
        ctx.status(200),
        ctx.cookie('session_id', newSessionId, { httpOnly: true }),
        ctx.json(response)
      );
    }
  ),

  rest.put<UpdatePasswordRequest, undefined, RequestParams>(
    url('UPDATE_PASSWORD_PATH'),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!isValidPassword(req.body.current_password, currentUser.password))
        return res(ctx.status(422));

      updatePasswordController.update({ currentUser, request: req.body });

      const newSessionId = regenerateSessionId(req.cookies.session_id);

      return res(
        ctx.status(200),
        ctx.cookie('session_id', newSessionId, { httpOnly: true })
      );
    }
  ),

  rest.post<ForgotPasswordRequest, undefined, RequestParams>(
    url('FORGOT_PASSWORD_PATH'),
    (req, res, ctx) => {
      const { email } = req.body;
      const requestedUser = db.where('users', 'email', email)[0];

      if (!requestedUser) return res(ctx.status(422));

      return res(ctx.status(200));
    }
  ),

  rest.post<ResetPasswordRequest, undefined, RequestParams>(
    url('RESET_PASSWORD_PATH'),
    (req, res, ctx) => {
      if (!isValidPasswordResetToken(req.body)) return res(ctx.status(422));

      resetPasswordController.reset(req.body);

      const newSessionId = regenerateSessionId(req.cookies.session_id);

      return res(
        ctx.status(200),
        ctx.cookie('session_id', newSessionId, { httpOnly: true })
      );
    }
  ),

  rest.post(url('SIGNOUT_PATH'), (req, res, ctx) => {
    const { session_id } = req.cookies;
    const token = req.headers.get(X_XSRF_TOKEN);

    if (!session_id) return res(ctx.status(401));

    if (!token || !hasValidToken(token)) return res(ctx.status(419));

    auth.logout();

    return res(
      ctx.status(204),
      ctx.cookie('session_id', '', { httpOnly: true })
    );
  }),

  rest.delete<DefaultRequestBody, undefined, RequestParams>(
    url('AUTH_USER_PATH'),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      deleteAccountController.remove(currentUser);

      return res(
        ctx.status(204),
        ctx.cookie('session_id', '', { httpOnly: true })
      );
    }
  ),
];

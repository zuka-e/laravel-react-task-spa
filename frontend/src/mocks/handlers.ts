import { DefaultRequestBody, RequestParams, rest } from 'msw';
import {
  API_HOST,
  AUTH_USER_PATH,
  GET_CSRF_TOKEN_PATH,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from '../config/api';
import {
  FetchAuthUserResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
} from '../store/slices/authSlice';
import { User } from '../models/User';
import {
  addUser,
  authenticate,
  sanitizeUser,
  saveUser,
  users,
  usersData,
  UsersSchema,
} from './models/users';
import { digestText } from './utils/hash';
import { hasValidToken, isUniqueEmail } from './utils/validation';

// HTTPメソッドとリクエストパス(第一引数)を指定し、`Request handler`を生成
// リクエストに対応するレスポンスのモックを`Response resolver`により作成

export const handlers = [
  rest.post<SignUpRequest, SignUpResponse, RequestParams>(
    API_HOST + SIGNUP_PATH,
    (req, res, ctx) => {
      const token = req.headers.get('X-XSRF-TOKEN');
      const { email, password } = req.body;

      // token mismatch error
      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      // validation error
      if (!isUniqueEmail(email)) return res(ctx.status(422));

      const session_id = digestText(email);
      const newUser: UsersSchema = {
        id: users.length + 1,
        name: email,
        email,
        emailVerifiedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        password: digestText(password),
      };

      addUser(newUser);
      saveUser();
      return res(
        ctx.status(201),
        ctx.cookie('session_id', session_id, { httpOnly: true }),
        ctx.json({ user: newUser } as SignUpResponse)
      );
    }
  ),

  rest.get(API_HOST + GET_CSRF_TOKEN_PATH, (_req, res, ctx) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const token = digestText(randomString);
    sessionStorage.setItem('token', token);
    return res(ctx.cookie('XSRF-TOKEN', token));
  }),

  rest.get<DefaultRequestBody, FetchAuthUserResponse, RequestParams>(
    API_HOST + AUTH_USER_PATH,
    (req, res, ctx) => {
      const { session_id } = req.cookies;
      if (!session_id) return res(ctx.status(401));

      const uuid = digestText(session_id);
      const userData = usersData[uuid];
      const statusCode = userData ? 200 : 401;
      const user = userData ? sanitizeUser(userData) : null;

      return res(ctx.status(statusCode), ctx.json({ user: user as User }));
    }
  ),

  rest.post<SignInRequest, SignInResponse, RequestParams>(
    API_HOST + SIGNIN_PATH,
    (req, res, ctx) => {
      try {
        const authenticatedUser = authenticate(req.body);
        return res(
          ctx.status(200),
          ctx.cookie('session_id', authenticatedUser.session_id, {
            httpOnly: true,
          }),
          ctx.json({
            user: authenticatedUser,
            verified: undefined,
          } as SignInResponse)
        );
      } catch (e) {
        console.log(e);
        return res(ctx.status(422));
      }
    }
  ),
];

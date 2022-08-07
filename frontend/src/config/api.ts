export const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost';
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
export const API_ROUTE = API_HOST + '/' + API_VERSION;

// paths
export const GET_CSRF_TOKEN_PATH =
  process.env.NEXT_PUBLIC_GET_CSRF_TOKEN_PATH || '/sanctum/csrf-cookie';

export const SIGNUP_PATH = process.env.NEXT_PUBLIC_SIGNUP_PATH || '/register';

export const VERIFICATION_NOTIFICATION_PATH =
  process.env.NEXT_PUBLIC_VERIFICATION_NOTIFICATION_PATH ||
  '/email/verification-notification';

export const SIGNIN_PATH = process.env.NEXT_PUBLIC_SIGNIN_PATH || '/login';

export const USER_INFO_PATH =
  process.env.NEXT_PUBLIC_USER_INFO_PATH || '/user/profile-information';

export const UPDATE_PASSWORD_PATH =
  process.env.NEXT_PUBLIC_UPDATE_PASSWORD_PATH || '/user/password';

export const SIGNOUT_PATH = process.env.NEXT_PUBLIC_SIGNOUT_PATH || '/logout';

export const FORGOT_PASSWORD_PATH =
  process.env.NEXT_PUBLIC_FORGOT_PASSWORD_PATH || '/forgot-password';

export const RESET_PASSWORD_PATH =
  process.env.NEXT_PUBLIC_RESET_PASSWORD_PATH || '/reset-password';

export const paths = {
  GET_CSRF_TOKEN_PATH,
  SIGNUP_PATH,
  VERIFICATION_NOTIFICATION_PATH,
  SIGNIN_PATH,
  USER_INFO_PATH,
  UPDATE_PASSWORD_PATH,
  SIGNOUT_PATH,
  FORGOT_PASSWORD_PATH,
  RESET_PASSWORD_PATH,
} as const;

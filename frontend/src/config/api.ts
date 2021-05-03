export const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

// paths
export const GET_CSRF_TOKEN_PATH =
  process.env.REACT_APP_GET_CSRF_TOKEN_PATH || '/sanctum/csrf-cookie';
export const FETCH_SIGNIN_STATE_PATH =
  process.env.REACT_APP_FETCH_SIGNIN_STATE_PATH ||
  '/api/user/confirmed-password-status';
export const SIGNUP_PATH = process.env.REACT_APP_SIGNUP_PATH || '/api/register';
export const VERIFICATION_NOTIFICATION_PATH =
  process.env.REACT_APP_VERIFICATION_NOTIFICATION_PATH ||
  '/api/email/verification-notification';
export const GET_AUTH_USER_PATH =
  process.env.REACT_APP_GET_AUTH_USER_PATH || '/api/v1/users/auth';
export const SIGNIN_PATH = process.env.REACT_APP_SIGNIN_PATH || '/api/login';
export const SIGNOUT_PATH = process.env.REACT_APP_SIGNOUT_PATH || '/api/logout';
export const FORGOT_PASSWORD_PATH =
  process.env.REACT_APP_FORGOT_PASSWORD_PATH || '/api/forgot-password';
export const RESET_PASSWORD_PATH =
  process.env.REACT_APP_RESET_PASSWORD_PATH || '/api/reset-password';
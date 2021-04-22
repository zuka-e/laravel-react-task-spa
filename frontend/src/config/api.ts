export const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost';
export const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

// paths
export const GET_CSRF_TOKEN_PATH =
  process.env.REACT_APP_GET_CSRF_TOKEN_PATH || '/sanctum/csrf-cookie';
export const SIGNIN_PATH = process.env.REACT_APP_SIGNIN_PATH || '/api/login';
export const SIGNOUT_PATH = process.env.REACT_APP_SIGNOUT_PATH || '/api/logout';
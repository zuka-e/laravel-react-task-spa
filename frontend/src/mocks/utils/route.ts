import { API_HOST, API_ROUTE, GET_CSRF_TOKEN_PATH, paths } from 'config/api';

export const url = (pathName: keyof typeof paths) => {
  const path = paths[pathName];
  const nonApiRouteList = [GET_CSRF_TOKEN_PATH];
  return nonApiRouteList.includes(path) ? API_HOST + path : API_ROUTE + path;
};

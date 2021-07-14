import axios, { AxiosError } from 'axios';

import { API_HOST, API_ROUTE } from 'config/api';

type ApiClientOption = {
  apiRoute?: boolean;
  intercepted?: boolean;
};

export const apiClient = (options?: ApiClientOption) => {
  /** @returns `true` even if the param is `undefined` (default) */
  const isNonApiRoute = () => options?.apiRoute === false;
  const isNotIntercepted = () => options?.intercepted === false;

  const apiClient = axios.create({
    baseURL: isNonApiRoute() ? API_HOST : API_ROUTE,
    withCredentials: true,
  });

  if (isNotIntercepted()) return apiClient;

  apiClient.interceptors.response.use(
    (response) => response, // response = 2xx の場合は素通り
    async (err) => {
      const { default: store } = await import('store');
      const { setFlash, signOut } = await import('store/slices/authSlice');

      const error = err as AxiosError;
      const statuscode = error.response?.status || 500;

      switch (statuscode) {
        case 401:
        case 419:
          store.dispatch(signOut()); // ->initializeAuthState()
          store.dispatch(
            setFlash({ type: 'error', message: 'ログインしてください' })
          );
          return Promise.reject(error);
        case 403:
          store.dispatch(
            setFlash({ type: 'error', message: '不正なリクエストです' })
          );
          return Promise.reject(error);
        case 500:
          store.dispatch(
            setFlash({ type: 'error', message: 'システムエラーが発生しました' })
          );
          return Promise.reject(error);
        default:
          return Promise.reject(error); // `return`欠落 -> "response undefined"
      }
    }
  );

  return apiClient;
};

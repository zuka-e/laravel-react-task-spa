import axios, { AxiosError } from 'axios';

import { API_HOST, API_VERSION } from 'config/api';

export const apiClient = (options?: { apiRoute?: boolean }) => {
  /** @returns `true` even if `apiRoute` is `undefined` */
  const isNonApiRoute = () => options?.apiRoute === false;
  const baseURL = API_HOST + (isNonApiRoute() ? '' : '/api/' + API_VERSION);
  const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

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
        default:
          store.dispatch(
            setFlash({ type: 'error', message: 'システムエラーが発生しました' })
          );
          return Promise.reject(error); // `return`欠落 -> "response undefined"
      }
    }
  );

  return apiClient;
};

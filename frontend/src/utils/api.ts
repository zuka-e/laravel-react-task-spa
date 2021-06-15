import axios, { AxiosError } from 'axios';

import { API_HOST, API_VERSION } from 'config/api';
import store from 'store';
import { setFlash, signOut } from 'store/slices/authSlice';

const apiClient = (params?: { nonApiRoute: true }) => {
  const nonApiRoute = !!params?.nonApiRoute; // 引数なし -> false
  const baseURL = nonApiRoute ? API_HOST : API_HOST + '/api/' + API_VERSION;
  const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  apiClient.interceptors.response.use(
    (response) => response, // response = 2xx の場合は素通り
    (err) => {
      const error = err as AxiosError;
      const statuscode = error.response?.status || 500;

      switch (statuscode) {
        case 401:
        case 419:
          store.dispatch(signOut()); // ->initializeAuthState()
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

export default apiClient;

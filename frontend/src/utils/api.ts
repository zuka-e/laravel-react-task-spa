import axios from 'axios';

import { API_HOST, API_VERSION } from 'config/api';
import store from 'store';
import { signOut } from 'store/slices/authSlice';

const apiClient = (params?: { nonApiRoute: true }) => {
  const nonApiRoute = !!params?.nonApiRoute; // 引数なし -> false
  const baseURL = nonApiRoute ? API_HOST : API_HOST + '/api/' + API_VERSION;
  const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  apiClient.interceptors.response.use(
    (response) => response, // response = 2xx の場合は素通り
    (error) => {
      if ([401, 419].includes(error.response?.status)) {
        // サーバー認証エラーの場合`store`からログイン状態を破棄
        store.dispatch(signOut()); // ->initializeAuthState()
        return Promise.reject(error);
      }
      // `return`必要 (欠落すると response undefined の要因に)
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export default apiClient;

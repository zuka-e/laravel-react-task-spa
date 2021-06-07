import axios from 'axios';

import { API_HOST } from 'config/api';

// `store`の利用不可、それを利用した関数も同様 (以下のエラー発生)
// TypeError: Cannot read property 'reducer' of undefined
export const authApiClient = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

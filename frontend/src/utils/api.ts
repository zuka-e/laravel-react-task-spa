import axios from 'axios';
import { API_ENDPOINT } from '../config/app';

const apiClient = axios.create({
  baseURL: API_ENDPOINT,
  withCredentials: true, // 異なるドメイン (Cross Origin) でのCookies有効化
});

export default apiClient;

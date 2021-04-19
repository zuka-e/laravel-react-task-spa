import axios from 'axios';
import { API_HOST, API_VERSION } from '../config/api';

const apiClient = axios.create({
  baseURL: API_HOST + '/api/' + API_VERSION,
  withCredentials: true, // 異なるドメイン (Cross Origin) でのCookies有効化
});

export default apiClient;

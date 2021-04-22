import axios from 'axios';
import { API_HOST, API_VERSION } from '../config/api';

const apiClient = (params?: { nonApiRoute: true }) => {
  const nonApiRoute = !!params?.nonApiRoute; // 引数なし -> false
  const baseURL = nonApiRoute ? API_HOST : API_HOST + '/api/' + API_VERSION;
  const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true,
  });

  return apiClient;
};

export default apiClient;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  API_HOST,
  GET_CSRF_TOKEN_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
} from '../../config/api';

// `store`の利用不可、それを利用した関数も同様 (以下のエラー発生)
// TypeError: Cannot read property 'reducer' of undefined
const authApiClient = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (payload: { email: string; password: string }, thunkApi) => {
    const { email, password } = payload;
    try {
      await authApiClient.get(GET_CSRF_TOKEN_PATH);
      const response = await authApiClient.post(SIGNIN_PATH, {
        email,
        password,
      });
      return response?.data;
    } catch (error) {
      // The server responded with a status code that falls out of 2xx
      if (error.response?.status === 422) {
        return Promise.reject({
          message: 'メールアドレスまたはパスワードが間違っています',
        });
      } // `authSlice`の`extraReducers`で`rejected`を呼び出す
      return Promise.reject(error);
    }
  }
);

export const fetchSignInState = createAsyncThunk(
  'auth/fetchSignInState',
  async () => {
    try {
      // 認証済みの場合CSRFトークンは有効 (初期化不要) 認証切れなら`419`
      await authApiClient.get(GET_CSRF_TOKEN_PATH);
      const response = await authApiClient.post(SIGNIN_PATH);
      // status: サーバー認証が有効の場合`200`それ以外なら`422`
      return response?.status === 200;
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

type AuthState = {
  signedIn: boolean | undefined;
  loading: boolean;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    signedIn: undefined,
    loading: false,
  } as AuthState,
  reducers: {
    signIn(state) {
      state.signedIn = true;
    },
    signOut(state) {
      state.signedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signInWithEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(signInWithEmail.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(fetchSignInState.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSignInState.fulfilled, (state, action) => {
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(fetchSignInState.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET_CSRF_TOKEN_PATH, SIGNIN_PATH } from '../../config/api';
import apiClient from '../../utils/api';
import { sessionStorageKeys, sessionStorageValues } from '../../config/app';

const authApiClient = apiClient({ nonApiRoute: true });

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

const { SIGNED_IN } = sessionStorageKeys;
const { TRUE } = sessionStorageValues;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    signedIn: false,
    loading: false,
  },
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
      sessionStorage.setItem(SIGNED_IN, TRUE); // 文字列のみ保存可 (値は不問)
      state.signedIn = true; // `sessionStorage`と同時に`store`も`siginedIn`へ
      state.loading = false;
    });
    builder.addCase(signInWithEmail.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchSignInState.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSignInState.fulfilled, (state, action) => {
      sessionStorage.setItem(SIGNED_IN, TRUE);
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(fetchSignInState.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice;

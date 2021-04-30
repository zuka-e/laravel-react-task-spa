import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  API_HOST,
  GET_CSRF_TOKEN_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
} from '../../config/api';
import { FlashMessageProps } from '../../templates/FlashMessage';

// `store`の利用不可、それを利用した関数も同様 (以下のエラー発生)
// TypeError: Cannot read property 'reducer' of undefined
const authApiClient = axios.create({
  baseURL: API_HOST,
  withCredentials: true,
});

type RejectWithValueType = {
  error: {
    message?: string;
    data: any;
  };
};

export const createUser = createAsyncThunk<
  any,
  {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  },
  { rejectValue: RejectWithValueType }
>('auth/createUser', async (payload, thunkApi) => {
  const { email, password, password_confirmation } = payload;
  try {
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    const response = await authApiClient.post(SIGNUP_PATH, {
      name: email,
      email,
      password,
      password_confirmation,
    });
    return response?.data;
  } catch (e) {
    // ステータスコード 2xx 以外を`catch`
    const error: AxiosError = e; // cast the error for access
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          // 他のバリデーションはフロントエンドで実施
          message: 'このメールアドレスは既に使用されています',
          data: error.response.data,
        },
      });
    } // `authSlice`の`extraReducers`で`rejected`を呼び出す
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

export const signInWithEmail = createAsyncThunk<
  any,
  { email: string; password: string; remember: string | undefined },
  { rejectValue: RejectWithValueType }
>('auth/signInWithEmail', async (payload, thunkApi) => {
  const { email, password, remember } = payload;
  try {
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    const response = await authApiClient.post(SIGNIN_PATH, {
      email,
      password,
      remember,
    });
    return response?.data;
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: 'メールアドレスまたはパスワードが間違っています',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

export const fetchSignInState = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValueType }
>('auth/fetchSignInState', async (_, thunkApi) => {
  try {
    // 認証済みの場合CSRFトークンは有効 (初期化不要) 認証切れなら`419`
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    await authApiClient.post(SIGNIN_PATH);
    // response.status: サーバー認証が有効の場合`200`それ以外なら`422`
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

export const putSignOut = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValueType }
>('auth/putSignOut', async (_, thunkApi) => {
  try {
    // status(response): ログイン状態によらず`204` 認証切れなら`419`
    await authApiClient.post(SIGNOUT_PATH);
  } catch (e) {
    const error: AxiosError = e;
    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
    }
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

type AuthState = {
  signedIn: boolean | undefined;
  loading: boolean;
  flash: FlashMessageProps | null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    signedIn: undefined,
    loading: false,
    flash: null,
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
    builder.addCase(createUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.signedIn = true;
      state.loading = false;
      state.flash = { type: 'success', message: 'ユーザー登録が完了しました' };
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(signInWithEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.signedIn = true;
      state.loading = false;
      state.flash = { type: 'success', message: 'ログインしました' };
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
    builder.addCase(putSignOut.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(putSignOut.fulfilled, (state, action) => {
      state.signedIn = false;
      state.loading = false;
      state.flash = { type: 'success', message: 'ログアウトしました' };
    });
    builder.addCase(putSignOut.rejected, (state, action) => {
      state.signedIn = undefined;
      state.loading = false;
    });
  },
});

export const { signIn, signOut } = authSlice.actions;

export default authSlice;

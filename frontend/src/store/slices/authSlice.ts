import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  API_HOST,
  FORGOT_PASSWORD_PATH,
  GET_AUTH_USER_PATH,
  GET_CSRF_TOKEN_PATH,
  RESET_PASSWORD_PATH,
  SIGNIN_PATH,
  SIGNOUT_PATH,
  SIGNUP_PATH,
  UPDATE_PASSWORD_PATH,
  UPDATE_USER_INFO_PATH,
  VERIFICATION_NOTIFICATION_PATH,
} from '../../config/api';
import { User } from '../../models/User';
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
  User,
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
    const response = await authApiClient.post(
      SIGNUP_PATH,
      {
        name: email,
        email,
        password,
        password_confirmation,
      },
      { validateStatus: (status) => status === 201 }
    );
    return response?.data?.user as User;
    // 正常時はステータスコード`201`, `response.data`なし
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
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export const fetchAuthUser = createAsyncThunk<
  User,
  void,
  { rejectValue: RejectWithValueType }
>('auth/fetchAuthUser', async (_, thunkApi) => {
  try {
    const response = await authApiClient.get(GET_AUTH_USER_PATH);
    return response?.data?.user as User;
  } catch (e) {
    const error: AxiosError = e;
    return thunkApi.rejectWithValue({
      error: { data: error?.response?.data },
    });
  }
});

export const sendEmailVerificationLink = createAsyncThunk<
  AxiosResponse<any>['status'],
  void,
  { rejectValue: RejectWithValueType }
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    // 正常時は`202`(認証済みの場合`204`)
    const response = await authApiClient.post(VERIFICATION_NOTIFICATION_PATH);
    return response.status;
  } catch (e) {
    const error: AxiosError = e;
    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
      thunkApi.dispatch(
        setFlash({ type: 'error', message: 'ログインしてください' })
      );
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

type SignInResponse = {
  user: User;
  verified: true | undefined;
};

export const signInWithEmail = createAsyncThunk<
  SignInResponse,
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
    } // 認証用メールから遷移して、認証リンクが無効だった場合
    else if (error.response?.status === 403) {
      thunkApi.dispatch(fetchAuthUser());
      thunkApi.dispatch(
        setFlash({ type: 'warning', message: '認証に失敗しました' })
      );
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export const updateProfile = createAsyncThunk<
  { username: string; email: string },
  { username: string; email: string },
  { rejectValue: RejectWithValueType }
>('auth/updateProfile', async (payload, thunkApi) => {
  const { username, email } = payload;
  try {
    await authApiClient.put(UPDATE_USER_INFO_PATH, {
      name: username,
      email,
    });
    return { username, email };
  } catch (e) {
    const error: AxiosError = e;
    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
      thunkApi.dispatch(
        setFlash({ type: 'error', message: 'ログインしてください' })
      );
    }
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: 'このメールアドレスは既に使用されています',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export const updatePassword = createAsyncThunk<
  void,
  { current_password: string; password: string; password_confirmation: string },
  { rejectValue: RejectWithValueType }
>('auth/updatePassword', async (payload, thunkApi) => {
  const { current_password, password, password_confirmation } = payload;
  try {
    await authApiClient.put(UPDATE_PASSWORD_PATH, {
      current_password,
      password,
      password_confirmation,
    });
  } catch (e) {
    const error: AxiosError = e;
    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
      thunkApi.dispatch(
        setFlash({ type: 'error', message: 'ログインしてください' })
      );
    }
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: 'パスワードが間違っています',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export const forgotPassword = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: RejectWithValueType }
>('auth/forgotPassword', async (payload, thunkApi) => {
  const { email } = payload;
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    const response = await authApiClient.post(FORGOT_PASSWORD_PATH, {
      email,
    });
    return response.data?.message;
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: '指定されたメールアドレスは存在しません',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export const resetPassword = createAsyncThunk<
  void,
  {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
  },
  { rejectValue: RejectWithValueType }
>('auth/resetPassword', async (payload, thunkApi) => {
  const { email, password, password_confirmation, token } = payload;
  try {
    // 正常時は`200`バリデーションエラー時は`422`
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    await authApiClient.post(RESET_PASSWORD_PATH, {
      email,
      password,
      password_confirmation,
      token,
    });
  } catch (e) {
    const error: AxiosError = e;
    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: '認証に失敗しました\n再度お試しください',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
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
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

type AuthState = {
  user: User | null;
  sentEmail: boolean;
  signedIn: boolean;
  loading: boolean;
  flash: FlashMessageProps[];
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { flash: [{}] } as AuthState,
  reducers: {
    setFlash(state, action: PayloadAction<FlashMessageProps>) {
      const { type, message } = action.payload;
      state.flash.push({ type, message });
    },
    deleteSentEmailState(state) {
      state.sentEmail = false;
    },
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
      state.user = action.payload;
      state.sentEmail = true;
      state.signedIn = true;
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'ユーザー登録が完了しました',
      });
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAuthUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.signedIn = true;
      state.loading = false;
    });
    builder.addCase(fetchAuthUser.rejected, (state, action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(sendEmailVerificationLink.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(sendEmailVerificationLink.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload === 202) {
        state.flash.push({
          type: 'success',
          message: '認証用メールを送信しました',
        });
      } else if (action.payload === 204) {
        state.sentEmail = false;
        state.flash.push({
          type: 'error',
          message: '既に認証済みです',
        });
      }
    });
    builder.addCase(sendEmailVerificationLink.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(signInWithEmail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.signedIn = true;
      state.loading = false;
      // 認証メールリンクからのリダイレクトの場合 `true`
      action.payload.verified
        ? state.flash.push({ type: 'success', message: '認証に成功しました' })
        : state.flash.push({ type: 'info', message: 'ログインしました' });
    });
    builder.addCase(signInWithEmail.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (!state.user) return; // `null`を排除 (state.user?利用不可)

      if (state.user.email !== action.payload.email) {
        state.user.name = action.payload.username;
        state.user.email = action.payload.email;
        state.user.emailVerifiedAt = null;
        state.flash.push({
          type: 'info',
          message: '認証用メールを送信しました',
        });
      } else {
        state.user.name = action.payload.username;
        state.user.email = action.payload.email;
        state.flash.push({
          type: 'success',
          message: 'ユーザー情報を更新しました',
        });
      }
      state.loading = false;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updatePassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.flash.push({
        type: 'success',
        message: 'パスワードを変更しました',
      });
      state.loading = false;
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'パスワード再設定用のメールを送信しました',
      });
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.flash.push({
        type: 'success',
        message: 'パスワードを再設定しました',
      });
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(putSignOut.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(putSignOut.fulfilled, (state, action) => {
      state.user = null;
      state.signedIn = false;
      state.loading = false;
      state.flash.push({ type: 'success', message: 'ログアウトしました' });
    });
    builder.addCase(putSignOut.rejected, (state, action) => {
      state.signedIn = false;
      state.loading = false;
    });
  },
});

export const {
  setFlash,
  deleteSentEmailState,
  signIn,
  signOut,
} = authSlice.actions;

export default authSlice;

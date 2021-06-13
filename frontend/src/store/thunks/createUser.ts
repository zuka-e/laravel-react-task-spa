import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { GET_CSRF_TOKEN_PATH, SIGNUP_PATH } from 'config/api';
import { User } from 'models/User';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

export type SignUpRequest = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type SignUpResponse = {
  user: User;
};

export const createUser = createAsyncThunk<
  SignUpResponse,
  SignUpRequest,
  { rejectValue: RejectWithValueType }
>('auth/createUser', async (payload, thunkApi) => {
  const { email, password, password_confirmation } = payload;
  try {
    await authApiClient.get(GET_CSRF_TOKEN_PATH);
    const response = await authApiClient.post(
      SIGNUP_PATH,
      { name: email, email, password, password_confirmation },
      { validateStatus: (status) => status === 201 }
    );
    return response?.data as SignUpResponse;
    // ステータスコード 201 以外を`catch`
  } catch (e) {
    const error: AxiosError = e; // cast the error for access
    if (error.response?.status === 422) {
      // 他のバリデーションはフロントエンドで実施
      return thunkApi.rejectWithValue({
        error: {
          message: 'このメールアドレスは既に使用されています',
          data: error.response.data,
        },
      });
    } // `Slice`の`extraReducers`の`rejected`を呼び出す
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default createUser;

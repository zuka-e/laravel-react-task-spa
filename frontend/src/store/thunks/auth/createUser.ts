// `createAsyncThunk` returns a standard Redux thunk action creator.
import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET_CSRF_TOKEN_PATH, SIGNUP_PATH } from 'config/api';
import { User } from 'models/User';
import { apiClient } from 'utils/api';
import {
  isHttpException,
  isInvalidRequest,
  makeErrorMessageFrom,
} from 'utils/api/errors';
import { RejectWithValue } from '../types';

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
  { rejectValue: RejectWithValue }
>('auth/createUser', async (payload, thunkApi) => {
  const { email, password, password_confirmation } = payload;
  try {
    await apiClient({ apiRoute: false }).get(GET_CSRF_TOKEN_PATH);
    const response = await apiClient().post(
      SIGNUP_PATH,
      { name: email, email, password, password_confirmation },
      { validateStatus: (status) => status === 201 } // `201`以外 error
    );
    return response?.data as SignUpResponse;
  } catch (error) {
    // 他のバリデーションはフロントエンドで実施
    if (isInvalidRequest(error))
      return thunkApi.rejectWithValue({
        error: { message: makeErrorMessageFrom(error) },
      });
    if (isHttpException(error))
      return thunkApi.rejectWithValue({
        error: {
          message: `${error.response.status}: ${error.response.data.message}`,
        },
      });
    // `Slice`の`extraReducers`の`rejected`を呼び出す
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});

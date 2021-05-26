import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { UPDATE_PASSWORD_PATH } from 'config/api';
import { setFlash, signOut } from 'store/slices/authSlice';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

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

export default updatePassword;

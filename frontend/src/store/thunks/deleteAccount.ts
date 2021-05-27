import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { AUTH_USER_PATH } from 'config/api';

import { setFlash, signOut } from 'store/slices/authSlice';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

export const deleteAccount = createAsyncThunk<
  any,
  void,
  { rejectValue: RejectWithValueType }
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    await authApiClient.delete(AUTH_USER_PATH);
  } catch (e) {
    const error: AxiosError = e;
    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
      thunkApi.dispatch(
        setFlash({ type: 'error', message: 'ログインしてください' })
      );
    }
    setFlash({ type: 'error', message: 'システムエラーが発生しました' });
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default deleteAccount;
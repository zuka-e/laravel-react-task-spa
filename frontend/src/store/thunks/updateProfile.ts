import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { UPDATE_USER_INFO_PATH } from 'config/api';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

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
    const { setFlash, signOut } = await import('store/slices/authSlice');

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

export default updateProfile;

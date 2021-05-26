import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { SIGNOUT_PATH } from 'config/api';
import { signOut } from 'store/slices/authSlice';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

export const signOutFromAPI = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValueType }
>('auth/signOutFromAPI', async (_, thunkApi) => {
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

export default signOutFromAPI;

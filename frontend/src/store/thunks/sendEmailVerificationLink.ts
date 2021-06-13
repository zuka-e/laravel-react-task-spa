import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';

import { VERIFICATION_NOTIFICATION_PATH } from 'config/api';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

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
    const { setFlash, signOut } = await import('store/slices/authSlice');

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

export default sendEmailVerificationLink;

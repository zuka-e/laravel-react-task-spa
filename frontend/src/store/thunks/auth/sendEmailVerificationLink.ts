import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { VERIFICATION_NOTIFICATION_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export const sendEmailVerificationLink = createAsyncThunk<
  AxiosResponse['status'],
  void,
  AsyncThunkConfig
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    // 正常時は`202`(認証済みの場合`204`)
    const response = await apiClient().post(VERIFICATION_NOTIFICATION_PATH);
    return response.status;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

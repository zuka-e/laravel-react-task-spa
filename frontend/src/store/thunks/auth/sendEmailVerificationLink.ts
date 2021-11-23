import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { VERIFICATION_NOTIFICATION_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import {
  isHttpException,
  isInvalidRequest,
  makeErrorMessageFrom,
} from 'utils/api/errors';
import { RejectWithValue } from '../types';

export const sendEmailVerificationLink = createAsyncThunk<
  AxiosResponse['status'],
  void,
  { rejectValue: RejectWithValue }
>('auth/sendVerificationLink', async (_, thunkApi) => {
  try {
    // 正常時は`202`(認証済みの場合`204`)
    const response = await apiClient().post(VERIFICATION_NOTIFICATION_PATH);
    return response.status;
  } catch (error) {
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
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});

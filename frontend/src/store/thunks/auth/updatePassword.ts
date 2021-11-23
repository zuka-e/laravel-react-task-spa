import { createAsyncThunk } from '@reduxjs/toolkit';

import { UPDATE_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import {
  isHttpException,
  isInvalidRequest,
  makeErrorMessageFrom,
} from 'utils/api/errors';
import { AsyncThunkConfig } from '../config';

export type UpdatePasswordRequest = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export const updatePassword = createAsyncThunk<
  void,
  UpdatePasswordRequest,
  AsyncThunkConfig
>('auth/updatePassword', async (payload, thunkApi) => {
  const { current_password, password, password_confirmation } = payload;
  try {
    await apiClient().put(UPDATE_PASSWORD_PATH, {
      current_password,
      password,
      password_confirmation,
    });
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

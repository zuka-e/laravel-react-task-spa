import { createAsyncThunk } from '@reduxjs/toolkit';

import { AUTH_USER_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { isHttpException } from 'utils/api/errors';
import { AsyncThunkConfig } from '../config';

type DeleteAccountResponse = {};

export const deleteAccount = createAsyncThunk<
  DeleteAccountResponse,
  void,
  AsyncThunkConfig
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    await apiClient().delete(AUTH_USER_PATH);
  } catch (error) {
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

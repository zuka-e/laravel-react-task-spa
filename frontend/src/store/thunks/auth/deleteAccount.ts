import { createAsyncThunk } from '@reduxjs/toolkit';

import { AUTH_USER_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

type DeleteAccountResponse = {};

export const deleteAccount = createAsyncThunk<
  DeleteAccountResponse,
  void,
  AsyncThunkConfig
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    await apiClient().delete(AUTH_USER_PATH);
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

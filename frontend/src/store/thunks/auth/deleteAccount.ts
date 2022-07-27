import { createAsyncThunk } from '@reduxjs/toolkit';

import { AUTH_USER_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

type DeleteAccountResponse = void;
type DeleteAccountRequest = void;

export const deleteAccount = createAsyncThunk<
  DeleteAccountResponse,
  DeleteAccountRequest,
  AsyncThunkConfig
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    await apiClient().delete(AUTH_USER_PATH);
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

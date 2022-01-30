import { createAsyncThunk } from '@reduxjs/toolkit';

import { UPDATE_PASSWORD_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

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
  try {
    await apiClient().put(UPDATE_PASSWORD_PATH, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

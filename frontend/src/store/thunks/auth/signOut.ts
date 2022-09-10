import { createAsyncThunk } from '@reduxjs/toolkit';

import { SIGNOUT_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export const signOut = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/signOut',
  async (_, thunkApi) => {
    try {
      // status(response): ログイン状態によらず`204` 認証切れなら`419`
      await apiClient().post(SIGNOUT_PATH);
    } catch (error) {
      return thunkApi.rejectWithValue(makeRejectValue(error));
    }
  }
);

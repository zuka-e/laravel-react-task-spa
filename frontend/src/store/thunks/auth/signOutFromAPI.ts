import { createAsyncThunk } from '@reduxjs/toolkit';

import { SIGNOUT_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { isHttpException } from 'utils/api/errors';
import { AsyncThunkConfig } from '../config';

export const signOutFromAPI = createAsyncThunk<void, void, AsyncThunkConfig>(
  'auth/signOutFromAPI',
  async (_, thunkApi) => {
    try {
      // status(response): ログイン状態によらず`204` 認証切れなら`419`
      await apiClient().post(SIGNOUT_PATH);
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
  }
);

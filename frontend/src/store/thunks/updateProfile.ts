import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { UPDATE_USER_INFO_PATH } from 'config/api';
import { authApiClient } from './utils/api';
import { RejectWithValueType } from '.';

export type UpdateProfileResponse = {
  name: string;
  email: string;
};

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export const updateProfile = createAsyncThunk<
  UpdateProfileResponse,
  UpdateProfileRequest,
  { rejectValue: RejectWithValueType }
>('auth/updateProfile', async (payload, thunkApi) => {
  const { name, email } = payload;
  try {
    await authApiClient.put(UPDATE_USER_INFO_PATH, { name, email });
    return { name, email }; // fulfill時は、requestの値をそのまま`return`
  } catch (e) {
    const error: AxiosError = e;
    const { setFlash, signOut } = await import('store/slices/authSlice');

    if (error.response && [401, 419].includes(error.response.status)) {
      thunkApi.dispatch(signOut());
      thunkApi.dispatch(
        setFlash({ type: 'error', message: 'ログインしてください' })
      );
    } else if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: {
          message: 'このメールアドレスは既に使用されています',
          data: error.response.data,
        },
      });
    }
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default updateProfile;

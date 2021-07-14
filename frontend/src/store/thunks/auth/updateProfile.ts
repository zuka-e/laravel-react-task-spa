import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { UPDATE_USER_INFO_PATH } from 'config/api';
import { apiClient } from 'utils/api';
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
    await apiClient().put(UPDATE_USER_INFO_PATH, { name, email });
    return { name, email }; // fulfill時は、requestの値をそのまま`return`
  } catch (e) {
    const error: AxiosError = e;

    if (error.response?.status === 422) {
      return thunkApi.rejectWithValue({
        error: { message: 'このメールアドレスは既に使用されています' },
      });
    }
    return thunkApi.rejectWithValue(error.response?.data);
  }
});

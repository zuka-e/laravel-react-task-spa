import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AsyncThunkConfig } from 'store/thunks/config';
import type { User } from 'models/User';
import { apiClient } from 'utils/api';
import { makeRejectValue } from 'store/thunks/utils';

export type VerifyEmailRequest = { url: string };
export type VerifyEmailResponse = { user: User };

const verifyEmail = createAsyncThunk<
  VerifyEmailResponse,
  VerifyEmailRequest,
  AsyncThunkConfig
>('auth/verifyEmail', async (payload, thunkApi) => {
  try {
    const response = await apiClient().get<VerifyEmailResponse>(payload.url);

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

export default verifyEmail;

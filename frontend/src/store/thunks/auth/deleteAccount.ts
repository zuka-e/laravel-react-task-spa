import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { AUTH_USER_PATH } from 'config/api';
import { apiClient } from 'utils/api';
import { RejectWithValue } from '../types';

type DeleteAccountResponse = {};

export const deleteAccount = createAsyncThunk<
  DeleteAccountResponse,
  void,
  { rejectValue: RejectWithValue }
>('auth/deleteAccount', async (_, thunkApi) => {
  try {
    await apiClient().delete(AUTH_USER_PATH);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkApi.rejectWithValue(error.response?.data);
    }
    return thunkApi.rejectWithValue({
      error: { message: String(error) },
    });
  }
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { apiClient } from 'utils/api';
import { TaskBoard } from 'models';
import { RejectWithValueType } from 'store/thunks';

export type FetchTaskBoardResponse = {
  data: TaskBoard;
};

export type FetchTaskBoardRequest = {
  userId: string;
  boardId: string;
  page?: string;
};

export const fetchTaskBoard = createAsyncThunk<
  FetchTaskBoardResponse,
  FetchTaskBoardRequest,
  { rejectValue: RejectWithValueType }
>('auth/fetchTaskBoard', async (payload, thunkApi) => {
  try {
    const { userId, boardId, page } = payload;
    const query = page ? `?page=${page}` : '';
    const url = `/users/${userId}/task_boards/${boardId}` + query;
    const response = await apiClient().get(url);
    return response?.data;
  } catch (e) {
    const error = e as AxiosError<RejectWithValueType>;
    return thunkApi.rejectWithValue({
      error: {
        message: 'システムエラーが発生しました',
        data: error?.response?.data,
      },
    });
  }
});

export default fetchTaskBoard;

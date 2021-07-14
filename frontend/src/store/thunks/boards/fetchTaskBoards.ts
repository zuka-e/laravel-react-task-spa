import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from 'utils/api';
import { TaskBoard } from 'models';
import { DataWithPagination, RejectWithValueType } from 'store/thunks';

export type FetchTaskBoardsResponse = DataWithPagination<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: string;
  page?: string;
};

export const fetchTaskBoards = createAsyncThunk<
  FetchTaskBoardsResponse,
  FetchTaskBoardsRequest,
  { rejectValue: RejectWithValueType }
>('auth/fetchTaskBoards', async (payload, thunkApi) => {
  try {
    const { userId, page } = payload;
    const query = page ? `?page=${page}` : '';
    const url = `/users/${userId}/task_boards` + query;
    const response = await apiClient().get(url);

    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

export default fetchTaskBoards;

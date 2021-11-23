import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath, ResponseWithPagination } from 'utils/api';
import { AsyncThunkConfig } from '../config';

export type FetchTaskBoardsResponse = ResponseWithPagination<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: string;
  page?: string;
};

export const fetchTaskBoards = createAsyncThunk<
  FetchTaskBoardsResponse,
  FetchTaskBoardsRequest,
  AsyncThunkConfig
>('boards/fetchTaskBoards', async (payload, thunkApi) => {
  const { userId, page } = payload;
  const query = page ? `?page=${page}` : '';
  const path = makePath(['users', userId], ['task_boards']) + query;

  try {
    const response = await apiClient().get(path);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

export default fetchTaskBoards;

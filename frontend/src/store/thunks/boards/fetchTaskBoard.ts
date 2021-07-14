import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from 'utils/api';
import { TaskBoard } from 'models';
import { RejectWithValue } from '../types';

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
  { rejectValue: RejectWithValue }
>('auth/fetchTaskBoard', async (payload, thunkApi) => {
  try {
    const { userId, boardId, page } = payload;
    const query = page ? `?page=${page}` : '';
    const url = `/users/${userId}/task_boards/${boardId}` + query;
    const response = await apiClient().get(url);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

export default fetchTaskBoard;

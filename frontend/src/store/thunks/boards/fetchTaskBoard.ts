import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { RejectWithValue } from '../types';

export type FetchTaskBoardResponse = {
  data: TaskBoard;
};

export type FetchTaskBoardRequest = {
  userId: string;
  boardId: string;
};

export const fetchTaskBoard = createAsyncThunk<
  FetchTaskBoardResponse,
  FetchTaskBoardRequest,
  { rejectValue: RejectWithValue }
>('boards/fetchTaskBoard', async (payload, thunkApi) => {
  const { userId, boardId } = payload;
  const path = makePath(['users', userId], ['task_boards', boardId]);

  try {
    const response = await apiClient().get(path);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

export default fetchTaskBoard;

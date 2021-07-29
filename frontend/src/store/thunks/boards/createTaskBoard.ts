import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type CreateTaskBoardResponse = {
  data: TaskBoard;
};

export type CreateTaskBoardRequest = Pick<TaskBoard, 'title'> &
  Partial<Pick<TaskBoard, 'description'>>;

export const createTaskBoard = createAsyncThunk<
  CreateTaskBoardResponse,
  CreateTaskBoardRequest,
  AsyncThunkConfig
>('boards/createTaskBoard', async (payload, thunkApi) => {
  const userId = String(thunkApi.getState().auth.user?.id);
  const url = makePath(['users', userId], ['task_boards']);

  try {
    const response = await apiClient().post(url, payload);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

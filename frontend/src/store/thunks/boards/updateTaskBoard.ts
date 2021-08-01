import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type UpdateTaskBoardResponse = {
  data: TaskBoard;
};

export type UpdateTaskBoardRequest = Pick<TaskBoard, 'id'> &
  Pick<TaskBoard, 'title'> &
  Partial<Pick<TaskBoard, 'description'>>;

export const updateTaskBoard = createAsyncThunk<
  UpdateTaskBoardResponse,
  UpdateTaskBoardRequest,
  AsyncThunkConfig
>('boards/updateTaskBoard', async (payload, thunkApi) => {
  const { id, ...mainPayload } = payload;
  const userId = String(thunkApi.getState().auth.user?.id);
  const url = makePath(['users', userId], ['task_boards', id]);

  try {
    const response = await apiClient().patch(url, mainPayload);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

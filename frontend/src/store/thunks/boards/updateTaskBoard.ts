import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from 'utils/api';
import { TaskBoard } from 'models';
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
  const userId = thunkApi.getState().auth.user?.id;
  const { id, ...mainPayload } = payload;
  try {
    const url = `/users/${userId}/task_boards/${id}`;
    const response = await apiClient().patch(url, mainPayload);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

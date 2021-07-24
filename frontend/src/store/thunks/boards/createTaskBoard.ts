import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from 'utils/api';
import { TaskBoard } from 'models';
import { AsyncThunkConfig } from '../types';

type CreateTaskBoardResponse = {
  data: TaskBoard;
};

type CreateTaskBoardRequest = Pick<TaskBoard, 'title'> &
  Partial<Pick<TaskBoard, 'description'>>;

export const createTaskBoard = createAsyncThunk<
  CreateTaskBoardResponse,
  CreateTaskBoardRequest,
  AsyncThunkConfig
>('boards/createTaskBoard', async (payload, thunkApi) => {
  const userId = thunkApi.getState().auth.user?.id;
  try {
    const url = `/users/${userId}/task_boards`;
    const response = await apiClient().post(url, payload);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

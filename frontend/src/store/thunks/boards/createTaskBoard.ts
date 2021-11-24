import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

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
  const path = makePath(['users', userId], ['task-boards']);

  try {
    const response = await apiClient().post(path, payload);
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

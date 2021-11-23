import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type UpdateTaskBoardResponse = {
  data: TaskBoard;
};

export type UpdateTaskBoardRequest = Partial<Pick<TaskBoard, 'title'>> &
  Partial<Pick<TaskBoard, 'description'>> &
  Partial<Pick<TaskBoard, 'listIndexMap'>> &
  Partial<Pick<TaskBoard, 'cardIndexMap'>>;

type UpdateTaskBoardArg = Pick<TaskBoard, 'id'> & UpdateTaskBoardRequest;

export const updateTaskBoard = createAsyncThunk<
  UpdateTaskBoardResponse,
  UpdateTaskBoardArg,
  AsyncThunkConfig
>('boards/updateTaskBoard', async (payload, thunkApi) => {
  const { id, ...mainPayload } = payload;
  const userId = String(thunkApi.getState().auth.user?.id);
  const path = makePath(['users', userId], ['task_boards', id]);

  try {
    const response = await apiClient().patch(path, mainPayload);
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

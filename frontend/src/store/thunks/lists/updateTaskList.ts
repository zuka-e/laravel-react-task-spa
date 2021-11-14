import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskList } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type UpdateTaskListResponse = {
  data: TaskList;
};

export type UpdateTaskListRequest = Partial<Pick<TaskList, 'title'>> &
  Partial<Pick<TaskList, 'description'>>;

export type UpdateTaskListArg = Pick<TaskList, 'id'> &
  Pick<TaskList, 'boardId'> &
  UpdateTaskListRequest;

export const updateTaskList = createAsyncThunk<
  UpdateTaskListResponse,
  UpdateTaskListArg,
  AsyncThunkConfig
>('lists/updateTaskList', async (payload, thunkApi) => {
  const { id, boardId, ...requestBody } = payload;
  const path = makePath(['task_boards', boardId], ['task_lists', id]);

  try {
    const response = await apiClient().patch(path, requestBody);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

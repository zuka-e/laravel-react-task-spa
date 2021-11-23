import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskList } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../config';

export type CreateTaskListResponse = {
  data: TaskList;
};

export type CreateTaskListRequest = Pick<TaskList, 'title'> &
  Partial<Pick<TaskList, 'description'>>;

export const createTaskList = createAsyncThunk<
  CreateTaskListResponse,
  Pick<TaskList, 'boardId'> & CreateTaskListRequest,
  AsyncThunkConfig
>('lists/createTaskList', async (payload, thunkApi) => {
  const { boardId, ...mainPayload } = payload;
  const path = makePath(['task_boards', boardId], ['task_lists']);

  try {
    const response = await apiClient().post(path, mainPayload);
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

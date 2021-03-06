import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskList } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type DestroyTaskListResponse = {
  data: TaskList;
};

export const destroyTaskList = createAsyncThunk<
  DestroyTaskListResponse,
  Pick<TaskList, 'id'> & Pick<TaskList, 'boardId'>,
  AsyncThunkConfig
>('lists/destroyTaskList', async (payload, thunkApi) => {
  const { setFlash } = await import('store/slices/authSlice');

  const { id, boardId } = payload;
  const path = makePath(['task_boards', boardId], ['task_lists', id]);

  try {
    const response = await apiClient().delete<DestroyTaskListResponse>(path);

    thunkApi.dispatch(
      setFlash({
        type: 'warning',
        message: `${response.data.data.title} は削除されました`,
      })
    );

    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

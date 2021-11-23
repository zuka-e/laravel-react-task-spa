import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../config';

export type DestroyTaskBoardResponse = {
  data: TaskBoard;
};

export type DestroyTaskBoardRequest = Pick<TaskBoard, 'id'> &
  Pick<TaskBoard, 'title'>;

export const destroyTaskBoard = createAsyncThunk<
  DestroyTaskBoardResponse,
  DestroyTaskBoardRequest,
  AsyncThunkConfig
>('boards/destroyTaskBoard', async (payload, thunkApi) => {
  const { setFlash } = await import('store/slices/authSlice');

  const userId = String(thunkApi.getState().auth.user?.id);
  const path = makePath(['users', userId], ['task_boards', payload.id]);

  try {
    const response = await apiClient().delete(path);
    thunkApi.dispatch(
      setFlash({
        type: 'warning',
        message: `${payload.title}は削除されました`,
      })
    );
    return response?.data;
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

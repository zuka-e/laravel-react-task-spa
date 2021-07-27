import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { setFlash } from 'store/slices';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

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
  const userId = thunkApi.getState().auth.user?.id;
  try {
    const url = makePath(['users', userId], ['task_boards', payload.id]);
    const response = await apiClient().delete(url);
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

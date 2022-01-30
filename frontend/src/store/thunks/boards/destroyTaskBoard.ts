import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type DestroyTaskBoardResponse = {
  data: TaskBoard;
};

export type DestroyTaskBoardRequest = Pick<TaskBoard, 'id' | 'title'>;

export const destroyTaskBoard = createAsyncThunk<
  DestroyTaskBoardResponse,
  DestroyTaskBoardRequest,
  AsyncThunkConfig
>('boards/destroyTaskBoard', async (payload, thunkApi) => {
  const { setFlash } = await import('store/slices/authSlice');

  const userId = String(thunkApi.getState().auth.user?.id);
  const path = makePath(['users', userId], ['task-boards', payload.id]);

  try {
    const response = await apiClient().delete(path);
    thunkApi.dispatch(
      setFlash({
        type: 'warning',
        message: `${payload.title}は削除されました`,
      })
    );
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

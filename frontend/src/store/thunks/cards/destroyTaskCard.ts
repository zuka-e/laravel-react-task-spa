import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type DestroyTaskCardResponse = {
  data: TaskCard;
};

export type DestroyTaskCardArg = Pick<TaskCard, 'id'> &
  Pick<TaskCard, 'boardId'> &
  Pick<TaskCard, 'listId'>;

export const destroyTaskCard = createAsyncThunk<
  Pick<TaskCard, 'boardId'> & DestroyTaskCardResponse,
  DestroyTaskCardArg,
  AsyncThunkConfig
>('cards/destroyTaskCard', async (payload, thunkApi) => {
  const { setFlash } = await import('store/slices/authSlice');

  const { id, listId } = payload;
  const path = makePath(['task_lists', listId], ['task_cards', id]);

  try {
    const response = await apiClient().delete<DestroyTaskCardResponse>(path);

    thunkApi.dispatch(
      setFlash({
        type: 'warning',
        message: `${response.data.data.title} は削除されました`,
      })
    );

    return { ...response?.data, boardId: payload.boardId };
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

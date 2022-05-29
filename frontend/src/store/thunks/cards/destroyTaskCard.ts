import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

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
  const path = makePath(['task-lists', listId], ['task-cards', id]);

  try {
    const response = await apiClient().delete<DestroyTaskCardResponse>(path);

    thunkApi.dispatch(
      setFlash({
        type: 'warning',
        message: `${response.data.data.title} は削除されました`,
      })
    );

    return { ...response?.data, boardId: payload.boardId };
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

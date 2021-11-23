import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type CreateTaskCardResponse = {
  data: TaskCard;
};

export type CreateTaskCardRequest = Pick<TaskCard, 'title'> &
  Partial<Pick<TaskCard, 'content'>> &
  Partial<Pick<TaskCard, 'deadline'>> &
  Partial<Pick<TaskCard, 'done'>>;

export const createTaskCard = createAsyncThunk<
  { boardId: string } & CreateTaskCardResponse,
  { boardId: string } & Pick<TaskCard, 'listId'> & CreateTaskCardRequest,
  AsyncThunkConfig
>('cards/createTaskCard', async (payload, thunkApi) => {
  const { boardId, listId, ...requestBody } = payload;
  const path = makePath(['task_lists', listId], ['task_cards']);

  try {
    const response = await apiClient().post(path, requestBody);

    return { ...response?.data, boardId: payload.boardId };
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

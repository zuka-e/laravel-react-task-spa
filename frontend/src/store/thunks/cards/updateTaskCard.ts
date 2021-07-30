import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type UpdateTaskCardResponse = {
  data: TaskCard;
};

export type UpdateTaskCardRequest = Pick<TaskCard, 'title'> &
  Partial<Pick<TaskCard, 'content'>> &
  Partial<Pick<TaskCard, 'deadline'>> &
  Partial<Pick<TaskCard, 'done'>>;

export type UpdateTaskCardArg = Pick<TaskCard, 'id'> &
  Pick<TaskCard, 'boardId'> &
  Pick<TaskCard, 'listId'> &
  UpdateTaskCardRequest;

export const updateTaskCard = createAsyncThunk<
  Pick<TaskCard, 'boardId'> & UpdateTaskCardResponse,
  UpdateTaskCardArg,
  AsyncThunkConfig
>('cards/updateTaskCard', async (payload, thunkApi) => {
  const { id, boardId, listId, ...requestBody } = payload;
  const path = makePath(['task_lists', listId], ['task_cards', id]);

  try {
    const response = await apiClient().patch(path, requestBody);
    return { ...response?.data, boardId: payload.boardId };
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from '../types';

export type UpdateTaskCardResponse = {
  data: TaskCard;
};

export type UpdateTaskCardRequest = Partial<Pick<TaskCard, 'listId'>> &
  Partial<Pick<TaskCard, 'title'>> &
  Partial<Pick<TaskCard, 'content'>> &
  Partial<Pick<TaskCard, 'deadline'>> &
  Partial<Pick<TaskCard, 'done'>>;

export type UpdateTaskCardArg = Pick<TaskCard, 'id'> &
  Pick<TaskCard, 'boardId'> &
  Pick<TaskCard, 'listId'> &
  UpdateTaskCardRequest & { body?: UpdateTaskCardRequest };

export const updateTaskCard = createAsyncThunk<
  Pick<TaskCard, 'boardId'> & UpdateTaskCardResponse,
  UpdateTaskCardArg,
  AsyncThunkConfig
>('cards/updateTaskCard', async (payload, thunkApi) => {
  const { id, boardId, listId, body, ...requestBody } = payload;
  const path = makePath(['task_lists', listId], ['task_cards', id]);
  /**
   * - `Data`型はタイムゾーンを反映させた値としてAPIリクエストを送る
   * - Laravel側ではこれを`DateTime`型にキャストして扱い、またDBに保存する
   *
   * @see https://laravel.com/docs/8.x/eloquent-mutators#date-casting-and-timezones
   */
  const request = !requestBody.deadline
    ? requestBody
    : { ...requestBody, deadline: requestBody.deadline.toLocaleString() };

  try {
    const response = await apiClient().patch(path, body ? body : request);
    return { ...response?.data, boardId: payload.boardId };
  } catch (e) {
    return thunkApi.rejectWithValue({
      error: { message: 'システムエラーが発生しました' },
    });
  }
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';

import { TaskCard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

type UpdateTaskCardRelationshipsResponse = Pick<AxiosResponse, 'status'>;

type UpdateTaskCardRelationshipsRequest = Pick<TaskCard, 'listId'>;

type UpdateTaskCardRelationshipsArg = {
  data: Pick<TaskCard, 'id'> & Pick<TaskCard, 'listId'>;
  body: UpdateTaskCardRelationshipsRequest;
};

export const updateTaskCardRelationships = createAsyncThunk<
  UpdateTaskCardRelationshipsResponse,
  UpdateTaskCardRelationshipsArg,
  AsyncThunkConfig
>('cards/updateTaskCardRelationships', async (payload, thunkApi) => {
  const path = makePath(
    ['task-lists', payload.data.listId],
    ['task-cards', payload.data.id]
  );

  try {
    const response = await apiClient().patch(path, payload.body);
    return { status: response.status };
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath, PaginationResponse } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type FetchTaskBoardsResponse = PaginationResponse<TaskBoard>;

export type FetchTaskBoardsRequest = {
  userId: string;
  page?: string;
};

export const fetchTaskBoards = createAsyncThunk<
  FetchTaskBoardsResponse,
  FetchTaskBoardsRequest,
  AsyncThunkConfig
>('boards/fetchTaskBoards', async (payload, thunkApi) => {
  const { userId, page } = payload;
  const path = makePath(['users', userId], ['task-boards']);

  try {
    const response = await apiClient().get(path, { params: { page } });
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

export default fetchTaskBoards;

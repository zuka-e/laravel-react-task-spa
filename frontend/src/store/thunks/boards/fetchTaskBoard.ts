import { createAsyncThunk } from '@reduxjs/toolkit';

import { TaskBoard } from 'models';
import { apiClient, makePath } from 'utils/api';
import { AsyncThunkConfig } from 'store/thunks/config';
import { makeRejectValue } from 'store/thunks/utils';

export type FetchTaskBoardResponse = {
  data: TaskBoard;
};

export type FetchTaskBoardRequest = {
  userId: string;
  boardId: string;
};

export const fetchTaskBoard = createAsyncThunk<
  FetchTaskBoardResponse,
  FetchTaskBoardRequest,
  AsyncThunkConfig
>('boards/fetchTaskBoard', async (payload, thunkApi) => {
  const { userId, boardId } = payload;
  const path = makePath(['users', userId], ['task-boards', boardId]);

  try {
    const response = await apiClient().get(path);
    return response?.data;
  } catch (error) {
    return thunkApi.rejectWithValue(makeRejectValue(error));
  }
});

export default fetchTaskBoard;

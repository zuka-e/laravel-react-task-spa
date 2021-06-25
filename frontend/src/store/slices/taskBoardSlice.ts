import { createSlice } from '@reduxjs/toolkit';

import { TaskBoardsCollection } from 'models';
import {
  fetchTaskBoards,
  fetchTaskBoard,
  FetchTaskBoardsResponse,
} from 'store/thunks/boards';

type TaskBoardState = {
  loading: boolean;
  docs: TaskBoardsCollection;
} & FetchTaskBoardsResponse;

const initialState: TaskBoardState = {
  loading: false,
  docs: {},
  data: [],
  links: {} as TaskBoardState['links'],
  meta: {} as TaskBoardState['meta'],
};

const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTaskBoards.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskBoards.fulfilled, (state, action) => {
      state.data = action.payload.data || [];
      state.links = action.payload.links || {};
      state.meta = action.payload.meta || {};
      state.loading = false;
    });
    builder.addCase(fetchTaskBoards.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(fetchTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(fetchTaskBoard.fulfilled, (state, action) => {
      const docId = action.payload.data.id;
      state.docs[docId] = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export default taskBoardSlice;
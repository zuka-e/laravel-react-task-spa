import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from 'models';
import {
  FetchTaskBoardsResponse,
  fetchTaskBoards,
  fetchTaskBoard,
  createTaskBoard,
  updateTaskBoard,
} from 'store/thunks/boards';

type InfoBoxAction =
  | { type: 'board'; data: TaskBoard }
  | { type: 'list'; data: TaskList }
  | { type: 'card'; data: TaskCard };

type InfoBoxState = { open: boolean } & InfoBoxAction;

type TaskBoardState = {
  loading: boolean;
  infoBox: InfoBoxState;
  docs: TaskBoardsCollection;
} & FetchTaskBoardsResponse;

const initialState = {
  loading: false,
  infoBox: {} as InfoBoxState,
  docs: {},
  data: [],
  links: {} as TaskBoardState['links'],
  meta: {} as TaskBoardState['meta'],
} as TaskBoardState;

export const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    openInfoBox(state, action: PayloadAction<InfoBoxAction>) {
      state.infoBox.open = true;
      state.infoBox.type = action.payload.type;
      state.infoBox.data = action.payload.data;
    },
    closeInfoBox(state) {
      state.infoBox.open = false;
    },
    removeInfoBox(state) {
      state.infoBox = initialState.infoBox;
    },
  },
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
    builder.addCase(createTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(createTaskBoard.fulfilled, (state, action) => {
      const newDoc = action.payload.data;
      state.data = [...state.data, { ...newDoc }];
      state.loading = false;
    });
    builder.addCase(createTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(updateTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(updateTaskBoard.fulfilled, (state, action) => {
      const board = state.data.find(
        (board) => board.id === action.payload.data.id
      );
      Object.assign(board, action.payload.data);
      state.loading = false;
    });
    builder.addCase(updateTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const { openInfoBox, closeInfoBox, removeInfoBox } =
  taskBoardSlice.actions;

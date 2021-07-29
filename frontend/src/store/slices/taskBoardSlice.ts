import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from 'models';
import {
  FetchTaskBoardsResponse,
  fetchTaskBoards,
  fetchTaskBoard,
  createTaskBoard,
  updateTaskBoard,
  destroyTaskBoard,
} from 'store/thunks/boards';
import { createTaskList, updateTaskList } from 'store/thunks/lists';

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
      state.docs[docId].lists = state.docs[docId].lists
        ? state.docs[docId].lists
        : [];
      state.docs[docId].lists.forEach(
        (list) => (list.cards = list.cards ? list.cards : [])
      );
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

      if (board?.id === state.infoBox.data?.id) state.infoBox.data = board;

      state.loading = false;
    });
    builder.addCase(updateTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });
    builder.addCase(destroyTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(destroyTaskBoard.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (board) => board.id !== action.payload.data.id
      );
      state.loading = false;
    });
    builder.addCase(destroyTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(createTaskList.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(createTaskList.fulfilled, (state, action) => {
      const newList = action.payload.data;
      newList.cards = newList.cards ? newList.cards : [];
      const boardId = newList.boardId;

      state.docs[boardId].lists = [
        ...state.docs[boardId].lists,
        { ...newList },
      ];
      state.loading = false;
    });

    builder.addCase(createTaskList.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskList.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskList.fulfilled, (state, action) => {
      const boardId = action.payload.data.boardId;
      const list = state.docs[boardId].lists.find(
        (list) => list.id === action.payload.data.id
      );
      Object.assign(list, action.payload.data);

      if (list?.id === state.infoBox.data?.id) state.infoBox.data = list;

      state.loading = false;
    });

    builder.addCase(updateTaskList.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const { openInfoBox, closeInfoBox, removeInfoBox } =
  taskBoardSlice.actions;

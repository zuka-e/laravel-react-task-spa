import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from 'models';
import {
  fetchTaskBoards,
  fetchTaskBoard,
  FetchTaskBoardsResponse,
} from 'store/thunks/boards';

export const infoBoxTypes = ['board', 'list', 'card'];

export type InfoBoxProps = {
  open?: boolean;
  type?: 'board' | 'list' | 'card';
  data?: TaskBoard | TaskList | TaskCard;
};

type TaskBoardState = {
  loading: boolean;
  infoBox: InfoBoxProps;
  docs: TaskBoardsCollection;
} & FetchTaskBoardsResponse;

const initialState: TaskBoardState = {
  loading: false,
  infoBox: { open: false },
  docs: {},
  data: [],
  links: {} as TaskBoardState['links'],
  meta: {} as TaskBoardState['meta'],
};

const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    openInfoBox(state, action: PayloadAction<InfoBoxProps>) {
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
  },
});

export const { openInfoBox, closeInfoBox, removeInfoBox } =
  taskBoardSlice.actions;

export default taskBoardSlice;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from 'models';
import {
  fetchTaskBoards,
  fetchTaskBoard,
  FetchTaskBoardsResponse,
} from 'store/thunks/boards';

export type InfoBoxProps = {
  type?: 'board' | 'list' | 'card';
  data?: TaskBoard | TaskList | TaskCard;
};

type TaskBoardState = {
  loading: boolean;
  infoBox: { open: number } & InfoBoxProps;
  docs: TaskBoardsCollection;
} & FetchTaskBoardsResponse;

const initialState: TaskBoardState = {
  loading: false,
  infoBox: { open: 0 },
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
      state.infoBox.open += 1;
      state.infoBox.type = action.payload.type;
      state.infoBox.data = action.payload.data;
    },
    closeInfoBox(state) {
      state.infoBox.open = 0;
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

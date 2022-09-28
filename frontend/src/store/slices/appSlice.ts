import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  httpStatus?: number;
};

const initialState: Partial<AppState> = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setHttpStatus(state, action: PayloadAction<AppState['httpStatus']>) {
      state.httpStatus = action.payload;
    },
    clearHttpStatus(state) {
      state.httpStatus = undefined;
    },
  },
});

export const { setHttpStatus, clearHttpStatus } = appSlice.actions;

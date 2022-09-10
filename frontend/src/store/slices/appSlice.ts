import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  notFound: boolean;
  httpStatus?: number;
};

const initialState: Partial<AppState> & Pick<AppState, 'notFound'> = {
  notFound: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setError404(state) {
      state.notFound = true;
    },
    releaseError404(state) {
      state.notFound = initialState.notFound;
    },
    setHttpStatus(state, action: PayloadAction<AppState['httpStatus']>) {
      state.httpStatus = action.payload;
    },
    clearHttpStatus(state) {
      state.httpStatus = undefined;
    },
  },
});

export const { setError404, releaseError404, setHttpStatus, clearHttpStatus } =
  appSlice.actions;

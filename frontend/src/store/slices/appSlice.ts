import { createSlice } from '@reduxjs/toolkit';

type AppState = {
  notFound: boolean;
};

const initialState = {} as AppState;

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
  },
});

export const { setError404, releaseError404 } = appSlice.actions;

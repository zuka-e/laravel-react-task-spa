import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';
import taskBoardSlice from './slices/taskBoardSlice';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
  boards: taskBoardSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;

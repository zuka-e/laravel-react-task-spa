import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/authSlice';

export const rootReducer = combineReducers({
  auth: authSlice.reducer,
});

const store = configureStore({ reducer: rootReducer });

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;

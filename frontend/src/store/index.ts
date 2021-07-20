import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';

import { appSlice } from './slices/appSlice';
import authSlice from './slices/authSlice';
import taskBoardSlice from './slices/taskBoardSlice';

export const rootReducer = combineReducers({
  app: appSlice.reducer,
  auth: authSlice.reducer,
  boards: taskBoardSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    /**
     *  If your state or actions are very large,
     *  the SerializableStateInvariantMiddleware,
     *  that causes a slowdown in dev, can be disabled
     *  */
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export default store;

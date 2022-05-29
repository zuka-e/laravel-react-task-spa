import type { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from 'store';

const options = {
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: CurriedGetDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
};

export const store = configureStore(options);

export const initializeStore = () => {
  const newStore = configureStore(options);
  Object.assign(store, { ...newStore });
};

export default store;

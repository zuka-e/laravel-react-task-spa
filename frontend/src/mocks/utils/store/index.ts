import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { rootReducer } from 'store';

const options = {
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
};

export let store = configureStore(options);

export const initializeStore = () => {
  store = configureStore(options);
};

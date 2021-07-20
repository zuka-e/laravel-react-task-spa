import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import { rootReducer } from 'store';

const options = {
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
};

export const store = configureStore(options);

export const initializeStore = () => {
  const newStore = configureStore(options);
  Object.assign(store, { ...newStore });
};

export default store;

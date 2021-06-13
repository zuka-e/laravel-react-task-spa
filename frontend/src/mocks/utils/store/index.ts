import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from 'store';

export let store = configureStore({ reducer: rootReducer });

export const initializeStore = () =>
  (store = configureStore({ reducer: rootReducer }));

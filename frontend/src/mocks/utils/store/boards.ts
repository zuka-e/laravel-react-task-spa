import { EnhancedStore } from '@reduxjs/toolkit';

import { RootState } from 'store';

export const isLoading = (store: EnhancedStore<RootState>) =>
  store.getState().boards.loading;

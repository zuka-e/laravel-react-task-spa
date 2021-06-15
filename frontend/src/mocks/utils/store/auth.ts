import { EnhancedStore } from '@reduxjs/toolkit';

import { RootState } from 'store';

export const getUserState = (store: EnhancedStore<RootState>) =>
  store.getState().auth.user;

export const isSentEmail = (store: EnhancedStore<RootState>) =>
  store.getState().auth.sentEmail;

export const isSignedIn = (store: EnhancedStore<RootState>) =>
  store.getState().auth.signedIn;

export const isLoading = (store: EnhancedStore<RootState>) =>
  store.getState().auth.loading;

export const getFlashState = (store: EnhancedStore<RootState>) =>
  store.getState().auth.flash;

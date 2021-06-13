import { EnhancedStore } from '@reduxjs/toolkit';

import { AuthState } from 'store/slices/authSlice';

export const getUserState = (store: EnhancedStore<{ auth: AuthState }>) =>
  store.getState().auth.user;

export const isSentEmail = (store: EnhancedStore<{ auth: AuthState }>) =>
  store.getState().auth.sentEmail;

export const isSignedIn = (store: EnhancedStore<{ auth: AuthState }>) =>
  store.getState().auth.signedIn;

export const isLoading = (store: EnhancedStore<{ auth: AuthState }>) =>
  store.getState().auth.loading;

export const getFlashState = (store: EnhancedStore<{ auth: AuthState }>) =>
  store.getState().auth.flash;

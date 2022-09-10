import store from 'store';
import { GUEST_EMAIL } from 'config/app';

export const isReady = () => store.getState().auth.signedIn !== undefined;

export const isSignedIn = () => store.getState().auth.signedIn;

export const isAfterRegistration = () =>
  store.getState().auth.afterRegistration;

export const isVerified = () => !!store.getState().auth.user?.emailVerifiedAt;

export const isGuest = () => store.getState().auth.user?.email === GUEST_EMAIL;

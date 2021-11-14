import { configureStore } from '@reduxjs/toolkit';

import {
  authSlice,
  FlashNotificationProps,
  removeEmailVerificationPage,
  setFlash,
  signIn,
  signOut,
} from 'store/slices/authSlice';
import { createUser, SignUpRequest } from 'store/thunks/auth';
import { generateRandomString, makeEmail } from 'utils/generator';

describe('authSlice reducers', () => {
  // `store`の生成
  const initializedStore = () =>
    configureStore({ reducer: { auth: authSlice.reducer } });

  // 初回`store`生成
  let store = initializedStore();

  // test毎に`store`を再生成 (初期化)
  beforeEach(() => {
    store = initializedStore();
  });

  describe('setFlash', () => {
    const emptyNewFlash: FlashNotificationProps = { type: 'info', message: '' };
    const hugeNewFlash: FlashNotificationProps = {
      type: 'error',
      message: '!@#$%^&*()_+[]\\{}|'.repeat(100),
    };

    const getFlashState = () => store.getState().auth.flash;

    it('should added a new flash to a`flash`state, once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(setFlash(emptyNewFlash));
      expect(getFlashState()).toEqual([emptyNewFlash]);
    });

    it('should added new flashes to a`flash`state, more than once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(setFlash(hugeNewFlash));
      expect(getFlashState()).toEqual([hugeNewFlash]);
      store.dispatch(setFlash(emptyNewFlash));
      expect(getFlashState()).toEqual([hugeNewFlash, emptyNewFlash]);
    });
  });

  describe('removeEmailVerificationPage', () => {
    const password = generateRandomString();
    const createdUser: SignUpRequest = {
      email: makeEmail(),
      password,
      password_confirmation: password,
    };

    const getAfterRegistrationState = () =>
      store.getState().auth.afterRegistration;

    it('should update a`removeEmailVerificationPage`state to false', async () => {
      // `true`の状態を用意する (手段は`createUser`のみ)
      expect(getAfterRegistrationState()).toEqual(undefined);
      await store.dispatch(createUser(createdUser));
      expect(getAfterRegistrationState()).toBeTruthy();

      store.dispatch(removeEmailVerificationPage());
      expect(getAfterRegistrationState()).toBeFalsy();
      expect(getAfterRegistrationState()).not.toEqual(undefined);
    });
  });

  describe('signIn', () => {
    const isSignedIn = () => store.getState().auth.signedIn;

    it('should update a`signedIn`state to true after login', () => {
      expect(isSignedIn()).toEqual(undefined);
      store.dispatch(signIn());
      expect(isSignedIn()).toBeTruthy();
    });
  });

  describe('signOut', () => {
    const isSignedIn = () => store.getState().auth.signedIn;

    it('should update a`signedIn`state to false after logout', () => {
      store.dispatch(signIn());
      expect(isSignedIn()).toBeTruthy();
      store.dispatch(signOut());
      expect(isSignedIn()).toBeFalsy();
      expect(isSignedIn()).not.toEqual(undefined);
    });
  });
});

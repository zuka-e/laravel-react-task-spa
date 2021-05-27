import { configureStore } from '@reduxjs/toolkit';

import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import authSlice, { signIn } from 'store/slices/authSlice';
import {
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
  signOutFromAPI,
} from 'store/thunks';

describe('Sign out from API', () => {
  const initializedStore = () =>
    configureStore({ reducer: { auth: authSlice.reducer } });

  let store = initializedStore();

  const isSignedIn = () => store.getState().auth.signedIn;
  const getUserState = () => store.getState().auth.user;

  beforeEach(() => {
    store = initializedStore();
  });

  it('should throw an error without a session', async () => {
    // `store`によるログイン状態を用意する
    store.dispatch(signIn());
    expect(isSignedIn()).toBeTruthy();
    // dispatch
    const response = await store.dispatch(signOutFromAPI());
    expect(signOutFromAPI.rejected.match(response)).toBeTruthy();
    expect(isSignedIn()).toBeFalsy();
    expect(isSignedIn()).not.toEqual(undefined);
  });

  it('should sign out successfully with a session', async () => {
    const signInRequest: SignInRequest = {
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    };
    // ログインリクエスト
    await store.dispatch(signInWithEmail(signInRequest));
    // セッション有効なら`fulfilled`
    const fetchAuthUserResponse = await store.dispatch(fetchAuthUser());
    expect(fetchAuthUser.fulfilled.match(fetchAuthUserResponse)).toBeTruthy();
    // ログアウト前の`store`を確認
    expect(isSignedIn()).toBeTruthy();
    expect(getUserState()).toBeTruthy();
    // dispatch
    const signOutResponse = await store.dispatch(signOutFromAPI());
    expect(signOutFromAPI.fulfilled.match(signOutResponse)).toBeTruthy();
    expect(isSignedIn()).toBeFalsy();
    expect(isSignedIn()).not.toEqual(undefined);
  });
});

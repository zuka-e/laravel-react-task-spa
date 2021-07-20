import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  deleteAccount,
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
} from 'store/thunks';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isLoading,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import { refresh } from 'mocks/data';

describe('Thunk for an account delete', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  beforeEach(() => {
    initializeStore();
    refresh();
  });

  describe('Rejected', () => {
    it('should receive an error without a session', async () => {
      store.dispatch(signIn()); //`store`によるログイン状態
      const response = await store.dispatch(deleteAccount()); // dispatch

      expect(deleteAccount.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toBeFalsy();
      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toEqual(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should receive an error without a valid token', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      sessionStorage.removeItem(CSRF_TOKEN); // token削除
      const response = await store.dispatch(deleteAccount()); // dispatch

      expect(deleteAccount.rejected.match(response)).toBeTruthy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should not be deleted if the request is rejected', async () => {
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.rejected.match(response)).toBeTruthy();
      if (!deleteAccount.rejected.match(response)) return;

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequest)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBeTruthy();
    });
  });

  describe('Fulfilled', () => {
    it('should delete an account', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.fulfilled.match(response)).toBeTruthy();

      expect(isLoading(store)).toBeFalsy();
      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toEqual(false);
      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'warning',
        message: 'アカウントは削除されました',
      });
      const fetchAuthUserResponse = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.fulfilled.match(fetchAuthUserResponse)).toBeFalsy();
    });

    it('should not be authenticated with the data before deleted', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.fulfilled.match(response)).toBeTruthy();

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequest)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBeFalsy();
    });
  });
});

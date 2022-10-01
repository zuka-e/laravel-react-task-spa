import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  deleteAccount,
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
} from 'store/thunks/auth';
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

      expect(isLoading(store)).toBe(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive an error without a valid token', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.rejected.match(response)).toBe(true);
      expect(store.getState().app.httpStatus).toBe(419);
    });

    it('should not be deleted if the request is rejected', async () => {
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.rejected.match(response)).toBe(true);
      if (!deleteAccount.rejected.match(response)) return;

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequest)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBe(true);
    });
  });

  describe('Fulfilled', () => {
    it('should delete an account', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.fulfilled.match(response)).toBe(true);

      expect(isLoading(store)).toBe(false);
      expect(isSignedIn(store)).toBe(false);
      expect(getUserState(store)).toBeNull();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'warning',
        message: 'アカウントは削除されました',
      });
      const fetchAuthUserResponse = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.fulfilled.match(fetchAuthUserResponse)).toBe(false);
    });

    it('should not be authenticated with the data before deleted', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const response = await store.dispatch(deleteAccount()); // dispatch
      expect(deleteAccount.fulfilled.match(response)).toBe(true);

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequest)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBe(false);
    });
  });
});

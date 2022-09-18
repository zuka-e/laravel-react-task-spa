import { GUEST_EMAIL, GUEST_NAME, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  SignInRequest,
  signInWithEmail,
  updateProfile,
} from 'store/thunks/auth';
import { isInvalidRequest } from 'utils/api/errors';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isLoading,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import { guestUser, refresh, unverifiedUser } from 'mocks/data';

describe('Thunk updating the user profile', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  beforeEach(() => {
    initializeStore();
    refresh();
  });

  describe('Rejected', () => {
    const request = { name: '', email: '' };

    it('should throw an error without a session', async () => {
      store.dispatch(signIn()); //`store`によるログイン状態
      // dispatch
      const response = await store.dispatch(updateProfile(request));

      expect(updateProfile.rejected.match(response)).toBe(true);
      expect(isLoading(store)).toBe(false);
      expect(isSignedIn(store)).toBe(false);
      expect(getUserState(store)).toBeNull();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should throw an error without a valid token', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      // dispatch
      await store.dispatch(updateProfile(request));

      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should throw an error with an existing email', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      // dispatch
      const existingEmail = unverifiedUser.email;
      const request = { name: '', email: existingEmail };
      const response = await store.dispatch(updateProfile(request));
      // 以下`rejected`
      if (!updateProfile.rejected.match(response)) return;

      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });
  });

  describe('Fulfilled', () => {
    const newName = GUEST_NAME + 'a';
    const newEmail = GUEST_EMAIL + 'a';

    it('should update the user with right inputs', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const currentUser = getUserState(store);
      if (!currentUser) return;
      // dispatch
      const request = { name: newName, email: currentUser.email };
      await store.dispatch(updateProfile(request));

      expect(isLoading(store)).toBe(false);
      expect(getUserState(store)?.name).toBe(newName);
      expect(getUserState(store)?.email).toBe(currentUser.email);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'ユーザー情報を更新しました',
      });
    });

    it('should send a verification email if updating a email', async () => {
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      const currentUser = getUserState(store);
      expect(currentUser?.name).toBe(guestUser.name);
      if (!currentUser) return;
      // dispatch
      const request = { name: currentUser.name, email: newEmail };
      const response = await store.dispatch(updateProfile(request));

      expect(updateProfile.fulfilled.match(response)).toBe(true);
      expect(isLoading(store)).toBe(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'info',
        message: '認証用メールを送信しました',
      });
    });
  });
});

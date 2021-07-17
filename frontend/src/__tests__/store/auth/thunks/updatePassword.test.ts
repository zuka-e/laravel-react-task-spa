import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  SignInRequest,
  signInWithEmail,
  updatePassword,
  UpdatePasswordRequest,
} from 'store/thunks/auth';
import { initializeStore, store } from 'mocks/utils/store';
import {
  getFlashState,
  getUserState,
  isLoading,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import { refresh } from 'mocks/data';

describe('Thunk updating the user password', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  beforeEach(() => {
    initializeStore();
    refresh();
  });

  describe('Rejected', () => {
    const request: UpdatePasswordRequest = {
      current_password: GUEST_PASSWORD,
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };

    it('should receive an error without a session', async () => {
      store.dispatch(signIn()); //`store`によるログイン状態
      // dispatch
      const response = await store.dispatch(updatePassword(request));

      expect(updatePassword.rejected.match(response)).toBeTruthy();
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
      await store.dispatch(updatePassword(request)); // dispatch

      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should receive an error if the password unmatchs', async () => {
      const request: UpdatePasswordRequest = {
        current_password: GUEST_PASSWORD + 'a',
        password: GUEST_PASSWORD,
        password_confirmation: GUEST_PASSWORD,
      };

      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      // dispatch
      const response = await store.dispatch(updatePassword(request));
      // 以下`rejected`
      if (!updatePassword.rejected.match(response)) return;

      expect(response.payload?.error.message).toEqual(
        'パスワードが間違っています'
      );
    });
  });

  describe('Fulfilled', () => {
    it('should be updated even if the same password', async () => {
      const request: UpdatePasswordRequest = {
        current_password: GUEST_PASSWORD,
        password: GUEST_PASSWORD,
        password_confirmation: GUEST_PASSWORD,
      };

      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      await store.dispatch(updatePassword(request)); // dispatch

      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'パスワードを変更しました',
      });
    });

    it('should be updated with the right inputs', async () => {
      const request: UpdatePasswordRequest = {
        current_password: GUEST_PASSWORD,
        password: GUEST_PASSWORD + 'a',
        password_confirmation: GUEST_PASSWORD + 'a',
      };

      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      await store.dispatch(updatePassword(request)); // dispatch

      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'パスワードを変更しました',
      });
    });
  });
});

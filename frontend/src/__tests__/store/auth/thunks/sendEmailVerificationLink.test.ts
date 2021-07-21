import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  sendEmailVerificationLink,
  SignInRequest,
  signInWithEmail,
} from 'store/thunks/auth';
import { unverifiedUser } from 'mocks/data/users';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isLoading,
  isAfterRegistration,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { CSRF_TOKEN } from 'mocks/utils/validation';

describe('Thunk requsting the Email verification link', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should throw an error without a session', async () => {
      // `store`によるログイン状態を用意する
      store.dispatch(signIn());
      expect(isSignedIn(store)).toBeTruthy();
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.rejected.match(response)).toBeTruthy();

      expect(isLoading(store)).toBeFalsy();
      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toEqual(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should throw an error without a valid token', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // token削除
      sessionStorage.removeItem(CSRF_TOKEN);
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.rejected.match(response)).toBeTruthy();

      expect(isLoading(store)).toBeFalsy();
      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toEqual(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });
  });

  describe('Fulfilled', () => {
    it('should not be the state right after registration if verified', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // 認証済みユーザー
      expect(getUserState(store)?.emailVerifiedAt).toBeTruthy();
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.fulfilled.match(response)).toBeTruthy();

      expect(isLoading(store)).toBeFalsy();
      expect(isAfterRegistration(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: '既に認証済みです',
      });
    });

    it('should send a verification email', async () => {
      const signInRequest: SignInRequest = {
        email: unverifiedUser.email,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // 未認証ユーザー
      expect(getUserState(store)?.emailVerifiedAt).toBeFalsy();
      // dispatch
      const response = await store.dispatch(sendEmailVerificationLink());
      expect(sendEmailVerificationLink.fulfilled.match(response)).toBeTruthy();

      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: '認証用メールを送信しました',
      });
    });
  });
});

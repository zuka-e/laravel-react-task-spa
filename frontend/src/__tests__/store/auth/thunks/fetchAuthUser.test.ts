import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
} from 'store/thunks/auth';
import { initializeStore, store } from 'mocks/store';
import { getUserState, isSignedIn } from 'mocks/utils/store/auth';
import { CSRF_TOKEN } from 'mocks/utils/validation';

describe('Thunk fetching the authenticated user', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should throw an error without a session', async () => {
      // `store`によるログイン状態を用意する
      store.dispatch(signIn());
      expect(isSignedIn(store)).toBe(true);
      // dispatch
      const response = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.rejected.match(response)).toBe(true);

      expect(getUserState(store)).toBeNull();
      expect(isSignedIn(store)).toBe(false);
    });

    it('should throw an error without a valid token', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // token削除
      localStorage.removeItem(CSRF_TOKEN);
      // dispatch
      const response = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.rejected.match(response)).toBe(true);

      expect(getUserState(store)).toBeNull();
      expect(isSignedIn(store)).toBe(false);
    });
  });

  describe('Fulfilled', () => {
    it('should retrieve the auth user if session exists', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログイン
      await store.dispatch(signInWithEmail(signInRequest));
      // dispatch
      const response = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.fulfilled.match(response)).toBe(true);
      if (!fetchAuthUser.fulfilled.match(response)) return;

      // 取得したデータが`store`にセットされているか確認
      expect(response.payload.user).toEqual(getUserState(store));
      expect(isSignedIn(store)).toBe(true);
    });
  });
});

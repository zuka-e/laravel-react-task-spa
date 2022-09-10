import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
  signOut,
} from 'store/thunks/auth';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isSignedIn,
} from 'mocks/utils/store/auth';

describe('Thunk logging out', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should throw an error without a session', async () => {
      // `store`によるログイン状態を用意する
      store.dispatch(signIn());
      expect(isSignedIn(store)).toBe(true);
      // dispatch
      const response = await store.dispatch(signOut());
      expect(signOut.rejected.match(response)).toBe(true);
      expect(isSignedIn(store)).toBe(false);
    });
  });

  describe('Fulfilled', () => {
    it('should sign out successfully with a session', async () => {
      const signInRequest: SignInRequest = {
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      };
      // ログインリクエスト
      await store.dispatch(signInWithEmail(signInRequest));
      // セッション有効なら`fulfilled`
      const fetchAuthUserResponse = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.fulfilled.match(fetchAuthUserResponse)).toBe(true);
      // ログアウト前の`store`を確認
      expect(isSignedIn(store)).toBe(true);
      expect(getUserState(store)).toBeTruthy();
      // dispatch
      const signOutResponse = await store.dispatch(signOut());
      expect(signOut.fulfilled.match(signOutResponse)).toBe(true);

      // state更新
      expect(isSignedIn(store)).toBe(false);
      expect(getUserState(store)).toBeNull();
      expect(getFlashState(store).slice(-1)[0].message).toEqual(
        'ログアウトしました'
      );
    });
  });
});

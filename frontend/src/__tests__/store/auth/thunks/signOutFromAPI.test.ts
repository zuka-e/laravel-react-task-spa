import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import {
  fetchAuthUser,
  SignInRequest,
  signInWithEmail,
  signOutFromAPI,
} from 'store/thunks';
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
      expect(isSignedIn(store)).toBeTruthy();
      // dispatch
      const response = await store.dispatch(signOutFromAPI());
      expect(signOutFromAPI.rejected.match(response)).toBeTruthy();
      expect(isSignedIn(store)).toBeFalsy();
      expect(isSignedIn(store)).not.toEqual(undefined);
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
      expect(fetchAuthUser.fulfilled.match(fetchAuthUserResponse)).toBeTruthy();
      // ログアウト前の`store`を確認
      expect(isSignedIn(store)).toBeTruthy();
      expect(getUserState(store)).toBeTruthy();
      // dispatch
      const signOutResponse = await store.dispatch(signOutFromAPI());
      expect(signOutFromAPI.fulfilled.match(signOutResponse)).toBeTruthy();

      // state更新
      expect(isSignedIn(store)).toBeFalsy();
      expect(isSignedIn(store)).not.toEqual(undefined);
      expect(getUserState(store)).toEqual(null);
      expect(getFlashState(store).slice(-1)[0].message).toEqual(
        'ログアウトしました'
      );
    });
  });
});

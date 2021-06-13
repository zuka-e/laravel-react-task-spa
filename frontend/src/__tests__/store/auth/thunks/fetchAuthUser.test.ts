import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { fetchAuthUser, SignInRequest, signInWithEmail } from 'store/thunks';
import { initializeStore, store } from 'mocks/utils/store';
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
      expect(isSignedIn(store)).toBeTruthy();
      // dispatch
      const response = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.rejected.match(response)).toBeTruthy();

      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toBeFalsy();
      expect(isSignedIn(store)).not.toEqual(undefined);
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
      const response = await store.dispatch(fetchAuthUser());
      expect(fetchAuthUser.rejected.match(response)).toBeTruthy();

      expect(getUserState(store)).toBeFalsy();
      expect(isSignedIn(store)).toBeFalsy();
      expect(isSignedIn(store)).not.toEqual(undefined);
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
      expect(fetchAuthUser.fulfilled.match(response)).toBeTruthy();

      if (fetchAuthUser.rejected.match(response)) return;
      // 取得したデータが`store`にセットされているか確認
      expect(response.payload.user).toEqual(getUserState(store));
      expect(isSignedIn(store)).toBeTruthy();
    });
  });
});

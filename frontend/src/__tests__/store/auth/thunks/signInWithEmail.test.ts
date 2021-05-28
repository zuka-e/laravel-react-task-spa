import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { SignInRequest, signInWithEmail } from 'store/thunks';
import { initializeStore, store } from 'mocks/utils/store';
import {
  getFlashState,
  getUserState,
  isSignedIn,
} from 'mocks/utils/store/auth';

describe('Thunk authenticating user with email', () => {
  beforeEach(() => {
    initializeStore();
  });

  it('should throw an error with a wrong input', async () => {
    const signInRequest: SignInRequest = {
      email: GUEST_EMAIL + 'a',
      password: GUEST_PASSWORD,
    };

    expect(isSignedIn(store)).toEqual(undefined);
    // ログインリクエスト
    const response = await store.dispatch(signInWithEmail(signInRequest));
    expect(signInWithEmail.rejected.match(response)).toBeTruthy();
    // `rejected`の場合
    if (signInWithEmail.fulfilled.match(response)) return;
    expect(response.payload?.error.message).toEqual(
      'メールアドレスまたはパスワードが間違っています'
    );
    expect(isSignedIn(store)).toEqual(false);
  });

  it('should be authenticated with a right input', async () => {
    const signInRequest: SignInRequest = {
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    };
    // ログイン
    const response = await store.dispatch(signInWithEmail(signInRequest));
    expect(signInWithEmail.fulfilled.match(response)).toBeTruthy();
    // `fulfilled`の場合
    if (signInWithEmail.rejected.match(response)) return;
    expect(response.payload?.user).toEqual(getUserState(store));
    expect(isSignedIn(store)).toBeTruthy();
    expect(getFlashState(store).slice(-1)[0]).toEqual({
      type: 'info',
      message: 'ログインしました',
    });
  });
});

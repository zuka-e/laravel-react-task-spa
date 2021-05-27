import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { initialAuthState } from 'store/slices/authSlice';
import { createUser, SignUpRequest } from 'store/thunks';
import { makeEmail } from 'utils/generator';
import { initializeStore, store } from 'mocks/utils/store';
import {
  getFlashState,
  getUserState,
  isSentEmail,
  isSignedIn,
} from 'mocks/utils/store/auth';

describe('Registration thunk', () => {
  beforeEach(() => {
    initializeStore();
  });

  it('should throw an error with an existing email', async () => {
    const newUser: SignUpRequest = {
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };
    // 登録リクエスト
    const response = await store.dispatch(createUser(newUser));
    expect(createUser.rejected.match(response)).toBeTruthy();
    // `rejected`時のレスポンスを参照するため`fulfilled`の条件で`return`
    if (createUser.fulfilled.match(response)) return;
    expect(response.payload?.error.message).toEqual(
      'このメールアドレスは既に使用されています'
    );
  });

  it('should create a new user', async () => {
    expect(getUserState(store)).toBeFalsy();
    expect(isSentEmail(store)).toBeFalsy();
    expect(isSignedIn(store)).toBeFalsy();

    const newUser: SignUpRequest = {
      email: makeEmail(),
      password: GUEST_PASSWORD,
      password_confirmation: GUEST_PASSWORD,
    };
    const response = await store.dispatch(createUser(newUser));
    expect(createUser.fulfilled.match(response)).toBeTruthy();
    // `fulfilled`のレスポンスを参照するため`rejected`の条件で`return`
    if (createUser.rejected.match(response)) return;
    expect(response.payload.user.name).toEqual(newUser.email);

    expect(getUserState(store)?.name).toEqual(newUser.email);
    expect(isSentEmail(store)).toBeTruthy();
    expect(isSignedIn(store)).toBeTruthy();
    expect(getFlashState(store).length).toEqual(
      initialAuthState.flash.length + 1
    );
  });
});

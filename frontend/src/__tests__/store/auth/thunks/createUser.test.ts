import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { createUser, SignUpRequest } from 'store/thunks/auth';
import { isInvalidRequest } from 'utils/api/errors';
import { makeEmail } from 'utils/generator';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isAfterRegistration,
  isSignedIn,
} from 'mocks/utils/store/auth';

describe('Thunk for an user registration', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
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

      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });
  });

  describe('Fulfilled', () => {
    it('should create a new user', async () => {
      expect(getUserState(store)).toBeFalsy();
      expect(isAfterRegistration(store)).toBeFalsy();
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
      expect(isAfterRegistration(store)).toBeTruthy();
      expect(isSignedIn(store)).toBeTruthy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'ユーザー登録が完了しました',
      });
    });
  });
});

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
      expect(createUser.rejected.match(response)).toBe(true);
      // `rejected`時のレスポンスを参照するため`fulfilled`の条件で`return`
      if (!createUser.rejected.match(response)) return;

      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });
  });

  describe('Fulfilled', () => {
    it('should create a new user', async () => {
      expect(getUserState(store)).toBeUndefined();
      expect(isAfterRegistration(store)).toBeUndefined();
      expect(isSignedIn(store)).toBeUndefined();

      const newUser: SignUpRequest = {
        email: makeEmail(),
        password: GUEST_PASSWORD,
        password_confirmation: GUEST_PASSWORD,
      };
      const response = await store.dispatch(createUser(newUser));
      expect(createUser.fulfilled.match(response)).toBe(true);

      if (!createUser.fulfilled.match(response)) return; // 以下`fulfilled`
      expect(response.payload.user.name).toBe(newUser.email);
      expect(getUserState(store)?.name).toBe(newUser.email);
      expect(isAfterRegistration(store)).toBe(true);
      expect(isSignedIn(store)).toBe(true);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'ユーザー登録が完了しました',
      });
    });
  });
});

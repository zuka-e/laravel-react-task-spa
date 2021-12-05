import { GUEST_EMAIL } from 'config/app';
import { forgotPassword, ForgotPasswordRequest } from 'store/thunks/auth';
import { isInvalidRequest } from 'utils/api/errors';
import { initializeStore, store } from 'mocks/store';
import { getFlashState, isLoading, isSignedIn } from 'mocks/utils/store/auth';

describe('Thunk for a forgot password', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    const request: ForgotPasswordRequest = {
      email: GUEST_EMAIL + 'a',
    };

    it('should receive an error if the email unmatchs', async () => {
      expect(isSignedIn(store)).toBeUndefined();
      const response = await store.dispatch(forgotPassword(request));
      expect(forgotPassword.rejected.match(response)).toBe(true);
      if (!forgotPassword.rejected.match(response)) return; // 以下`rejected`

      expect(isLoading(store)).toBe(false);
      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });
  });

  describe('Fulfilled', () => {
    const request: ForgotPasswordRequest = {
      email: GUEST_EMAIL,
    };

    it('should send an email if an requested email exists', async () => {
      expect(isSignedIn(store)).toBeUndefined();
      await store.dispatch(forgotPassword(request)); // dispatch

      expect(isLoading(store)).toBe(false);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'パスワード再設定用のメールを送信しました',
      });
    });
  });
});

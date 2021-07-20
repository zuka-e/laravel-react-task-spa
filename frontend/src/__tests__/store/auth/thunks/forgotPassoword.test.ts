import { GUEST_EMAIL } from 'config/app';
import { forgotPassword, ForgotPasswordRequest } from 'store/thunks';
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
      expect(isSignedIn(store)).toBeFalsy();
      const response = await store.dispatch(forgotPassword(request));
      if (!forgotPassword.rejected.match(response)) return;
      // 以下`rejected`
      expect(forgotPassword.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toBeFalsy();
      expect(response.payload?.error.message).toEqual(
        '指定されたメールアドレスは存在しません'
      );
    });
  });

  describe('Fulfilled', () => {
    const request: ForgotPasswordRequest = {
      email: GUEST_EMAIL,
    };

    it('should send an email if an requested email exists', async () => {
      expect(isSignedIn(store)).toBeFalsy();
      await store.dispatch(forgotPassword(request)); // dispatch

      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'パスワード再設定用のメールを送信しました',
      });
    });
  });
});

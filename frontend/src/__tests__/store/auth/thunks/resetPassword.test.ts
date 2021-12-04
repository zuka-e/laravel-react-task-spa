import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import {
  resetPassword,
  ResetPasswordRequest,
  SignInRequest,
  signInWithEmail,
} from 'store/thunks/auth';
import { initializeStore, store } from 'mocks/store';
import { getFlashState, isLoading, isSignedIn } from 'mocks/utils/store/auth';
import { validPasswordResetTokenOf } from 'mocks/utils/validation';

describe('Thunk for resetting the password', () => {
  const ownEmail = GUEST_EMAIL;
  const currentPassword = GUEST_PASSWORD;

  const request: ResetPasswordRequest = {
    email: ownEmail,
    password: 'new-password',
    password_confirmation: 'new-password',
    token: validPasswordResetTokenOf[ownEmail],
  };

  const signInRequestWithOriginalPassword: SignInRequest = {
    email: ownEmail,
    password: currentPassword,
  };

  const signInRequestWithUpdatedPassword: SignInRequest = {
    email: ownEmail,
    password: request.password,
  };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    const invalidReq = { ...request, token: '' };

    it('should be an error with a set of email and token', async () => {
      expect(isSignedIn(store)).toBeFalsy();
      const invalidReq = { ...request, email: ownEmail + 'a' };
      const response = await store.dispatch(resetPassword(invalidReq));
      expect(resetPassword.rejected.match(response)).toBeTruthy();
      if (!resetPassword.rejected.match(response)) return;

      expect(isLoading(store)).toBeFalsy();
      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });

    it('should receive an error if the token unmatchs', async () => {
      expect(isSignedIn(store)).toBeFalsy();
      const response = await store.dispatch(resetPassword(invalidReq));
      expect(resetPassword.rejected.match(response)).toBeTruthy();
      if (!resetPassword.rejected.match(response)) return;

      expect(resetPassword.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toBeFalsy();
      const error = response.payload?.error;
      expect(isInvalidRequest(error) && error.response.status).toBe(422);
    });

    it('should be authenticated with a original password', async () => {
      const response = await store.dispatch(resetPassword(invalidReq));
      expect(resetPassword.rejected.match(response)).toBeTruthy();
      if (!resetPassword.rejected.match(response)) return;

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequestWithOriginalPassword)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBeTruthy();
    });

    it('should not be authenticated with a requested password', async () => {
      const response = await store.dispatch(resetPassword(invalidReq));
      expect(resetPassword.rejected.match(response)).toBeTruthy();
      if (!resetPassword.rejected.match(response)) return;

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequestWithUpdatedPassword)
      );
      expect(signInWithEmail.rejected.match(signInResponse)).toBeTruthy();
    });
  });

  describe('Fulfilled', () => {
    it('should update the password with a valid request', async () => {
      expect(isSignedIn(store)).toBeFalsy();
      await store.dispatch(resetPassword(request)); // dispatch

      expect(isLoading(store)).toBeFalsy();
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'success',
        message: 'パスワードを再設定しました',
      });
    });

    it('should be authenticated with a updated password', async () => {
      const response = await store.dispatch(resetPassword(request));
      expect(resetPassword.fulfilled.match(response)).toBeTruthy();

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequestWithUpdatedPassword)
      );
      expect(signInWithEmail.fulfilled.match(signInResponse)).toBeTruthy();
    });

    it('should not be authenticated with a previous password', async () => {
      const response = await store.dispatch(resetPassword(request));
      expect(resetPassword.fulfilled.match(response)).toBeTruthy();

      const signInResponse = await store.dispatch(
        signInWithEmail(signInRequestWithOriginalPassword)
      );
      expect(signInWithEmail.rejected.match(signInResponse)).toBeTruthy();
    });
  });
});

import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import { fetchTaskBoard } from 'store/thunks/boards';
import { initializeStore, store } from 'mocks/store';
import { getUserState, isSignedIn } from 'mocks/utils/store/auth';
import { isLoading } from 'mocks/utils/store/boards';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import {
  boardOfGuestUser,
  boardOfUnverifiedUser,
  guestUser,
  otherUser,
  unverifiedUser,
} from 'mocks/data';

describe('Thunk fetching the details of a task board', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should receive an error without a session', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      store.dispatch(signIn()); //`store`によるログイン状態
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)).toBeFalsy();
      const response = await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );

      expect(fetchTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive an error without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );

      expect(fetchTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(419);
    });

    it('should receive an error if accessing data of others', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        fetchTaskBoard({ userId: otherUser.id, boardId: boardOfGuestUser.id })
      );

      expect(fetchTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true); // ログインは維持
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      expect(store.getState().app.httpStatus).toBe(403);
    });

    it('should receive an error unless having been verified', async () => {
      const loginAsUnverifiedUser = async () => {
        const signInRequest: SignInRequest = {
          email: unverifiedUser.email,
          password: GUEST_PASSWORD,
        };
        return store.dispatch(signInWithEmail(signInRequest));
      };
      expect(isSignedIn(store)).toEqual(undefined);
      await loginAsUnverifiedUser();
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      const response = await store.dispatch(
        fetchTaskBoard({
          userId: guestUser.id,
          boardId: boardOfUnverifiedUser.id,
        })
      );

      expect(fetchTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(store.getState().app.httpStatus).toBe(403);
    });

    it('should receive an error if a board does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        fetchTaskBoard({
          userId: guestUser.id,
          boardId: boardOfUnverifiedUser.id + '!@#',
        })
      );

      expect(fetchTaskBoard.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.httpStatus).toBe(404);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });
  });

  describe('Fulfilled', () => {
    it('should retrieve the details of own board', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      const response = await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );

      expect(fetchTaskBoard.fulfilled.match(response)).toBeTruthy();
      if (fetchTaskBoard.rejected.match(response)) return;
      expect(response.payload.data.id).toEqual(boardOfGuestUser.id);
      expect(store.getState().boards.docs[boardOfGuestUser.id].id).toEqual(
        boardOfGuestUser.id
      );
    });
  });
});

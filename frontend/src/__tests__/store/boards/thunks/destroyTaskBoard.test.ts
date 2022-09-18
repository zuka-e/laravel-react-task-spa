import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import {
  fetchTaskBoards,
  destroyTaskBoard,
  DestroyTaskBoardRequest,
} from 'store/thunks/boards';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { isLoading } from 'mocks/utils/store/boards';
import { uuid } from 'mocks/utils/uuid';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import { boardOfGuestUser, guestUser, unverifiedUser } from 'mocks/data';

describe('Thunk for destroying a task board', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const payload: DestroyTaskBoardRequest = { ...boardOfGuestUser };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should receive an error without a session', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      store.dispatch(signIn()); //`store`によるログイン状態
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)).toBeFalsy();
      const response = await store.dispatch(destroyTaskBoard(payload));

      expect(destroyTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(false);
      expect(getUserState(store)).toEqual(null);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
    });

    it('should receive an error without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(destroyTaskBoard(payload));

      expect(destroyTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(false);
      expect(getUserState(store)).toEqual(null);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: 'ログインしてください',
      });
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
      const response = await store.dispatch(destroyTaskBoard(payload));

      expect(destroyTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: '不正なリクエストです',
      });
    });

    it('should receive 404 if a board does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        destroyTaskBoard({ ...payload, id: uuid() })
      );

      expect(destroyTaskBoard.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.notFound).toEqual(true);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });
  });

  describe('Fulfilled', () => {
    const exists = (boardId: string) =>
      !!store.getState().boards.data.find((board) => board.id === boardId);

    it('should delete a specified board after fetching the board', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(fetchTaskBoards({ userId: guestUser.id }));
      expect(exists(payload.id)).toEqual(true);
      const response = await store.dispatch(destroyTaskBoard(payload));

      expect(destroyTaskBoard.fulfilled.match(response)).toBeTruthy();
      if (destroyTaskBoard.rejected.match(response)) return;
      expect(response.payload.data.id).toEqual(payload.id);
      expect(exists(payload.id)).toEqual(false);
    });
  });
});

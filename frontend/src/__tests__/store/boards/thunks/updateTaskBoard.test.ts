import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import {
  fetchTaskBoards,
  updateTaskBoard,
  UpdateTaskBoardRequest,
} from 'store/thunks/boards';
import { generateRandomString } from 'utils/generator';
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

describe('Thunk updating a task board', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const payload: UpdateTaskBoardRequest = {
    id: boardOfGuestUser.id,
    title: generateRandomString(20),
    description: generateRandomString(255),
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
      const response = await store.dispatch(updateTaskBoard(payload));

      expect(updateTaskBoard.rejected.match(response)).toBeTruthy();
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
      const response = await store.dispatch(updateTaskBoard(payload));

      expect(updateTaskBoard.rejected.match(response)).toBeTruthy();
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
      const response = await store.dispatch(updateTaskBoard(payload));

      expect(updateTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: '不正なリクエストです',
      });
    });

    it('should receive an error if a board does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskBoard({ ...payload, id: uuid() })
      );

      expect(updateTaskBoard.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.notFound).toEqual(true);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });
  });

  describe('Fulfilled', () => {
    const getBoardState = () =>
      store.getState().boards.data.find((board) => board.id === payload.id);

    it('should update a specified board after fetching the board', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(fetchTaskBoards({ userId: guestUser.id }));

      const before = getBoardState();
      expect(before?.title).not.toEqual(payload.title);
      expect(before?.description).not.toEqual(payload.description);

      const response = await store.dispatch(updateTaskBoard(payload));
      expect(updateTaskBoard.fulfilled.match(response)).toBeTruthy();
      if (updateTaskBoard.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(payload.title);
      expect(response.payload.data.description).toEqual(payload.description);

      const after = getBoardState();
      expect(after?.id).toEqual(payload.id);
      expect(after?.title).toEqual(payload.title);
      expect(after?.description).toEqual(payload.description);
      expect(after?.updatedAt).not.toEqual(before?.updatedAt);
    });
  });
});

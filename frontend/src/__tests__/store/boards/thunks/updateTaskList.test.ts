import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import { fetchTaskBoard } from 'store/thunks/boards';
import { updateTaskList, UpdateTaskListRequest } from 'store/thunks/lists';
import { generateRandomString } from 'utils/generator';
import { initializeStore, store } from 'mocks/store';
import { getUserState, isSignedIn } from 'mocks/utils/store/auth';
import { isLoading } from 'mocks/utils/store/boards';
import { uuid } from 'mocks/utils/uuid';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import {
  guestUser,
  unverifiedUser,
  boardOfGuestUser,
  boardOfOtherUser,
  listOfGuestUser,
  listOfOtherUser,
} from 'mocks/data';

describe('Thunk updating a task list', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const requestBody: UpdateTaskListRequest = {
    title: generateRandomString(20),
    description: generateRandomString(255),
  };

  const payload: { id: string; boardId: string } & UpdateTaskListRequest = {
    id: listOfGuestUser.id,
    boardId: listOfGuestUser.boardId,
    ...requestBody,
  };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should receive 401 without a session', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      store.dispatch(signIn()); //`store`によるログイン状態
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)).toBeFalsy();
      const response = await store.dispatch(updateTaskList(payload));

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive 419 without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(updateTaskList(payload));

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(419);
    });

    it('should receive 403 unless having been verified', async () => {
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
      const response = await store.dispatch(updateTaskList(payload));

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(store.getState().app.httpStatus).toBe(403);
    });

    it('should receive 404 if the parent does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskList({ ...payload, boardId: uuid() })
      );

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.httpStatus).toBe(404);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });

    it('should receive 403 unless owning the parent', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskList({ ...payload, boardId: boardOfOtherUser.id })
      );

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(store.getState().app.httpStatus).toBe(403);
    });

    it('should receive 404 if the list does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskList({ ...payload, id: uuid() })
      );

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.httpStatus).toBe(404);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });

    it('should receive 403 unless owning the list', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskList({ ...payload, id: listOfOtherUser.id })
      );

      expect(updateTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(store.getState().app.httpStatus).toBe(403);
    });
  });

  describe('Fulfilled', () => {
    const getListState = () => {
      const board = store.getState().boards.docs[boardOfGuestUser.id];
      const list = board.lists.find((list) => list.id === payload.id);
      return list;
    };

    it('should update the list after fetching the board with the list', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );

      const before = getListState();
      expect(before?.title).not.toEqual(payload.title);
      expect(before?.description).not.toEqual(payload.description);

      const response = await store.dispatch(updateTaskList(payload));
      expect(updateTaskList.fulfilled.match(response)).toBeTruthy();
      if (updateTaskList.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(payload.title);
      expect(response.payload.data.description).toEqual(payload.description);

      const after = getListState();
      expect(after?.id).toEqual(payload.id);
      expect(after?.title).toEqual(payload.title);
      expect(after?.description).toEqual(payload.description);
      expect(after?.updatedAt).not.toEqual(before?.updatedAt);
    });
  });
});

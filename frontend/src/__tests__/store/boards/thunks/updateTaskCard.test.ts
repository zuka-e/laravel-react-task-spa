import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import { fetchTaskBoard } from 'store/thunks/boards';
import {
  updateTaskCard,
  UpdateTaskCardArg,
  UpdateTaskCardRequest,
} from 'store/thunks/cards';
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
  cardOfGuestUser,
  cardOfOtherUser,
  listOfGuestUser,
  listOfOtherUser,
} from 'mocks/data';

describe('Thunk updating a task card', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const requestBody: UpdateTaskCardRequest = {
    title: generateRandomString(20),
    content: generateRandomString(255),
    deadline: new Date(),
    done: !cardOfGuestUser.done,
  };

  const payload: UpdateTaskCardArg = {
    id: cardOfGuestUser.id,
    boardId: listOfGuestUser.boardId,
    listId: listOfGuestUser.id,
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
      const response = await store.dispatch(updateTaskCard(payload));

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive 419 without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(updateTaskCard(payload));

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
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
      const response = await store.dispatch(updateTaskCard(payload));

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
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
        updateTaskCard({ ...payload, listId: uuid() })
      );

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
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
        updateTaskCard({ ...payload, listId: listOfOtherUser.id })
      );

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(store.getState().app.httpStatus).toBe(403);
    });

    it('should receive 404 if the card does not exist', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskCard({ ...payload, id: uuid() })
      );

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
      expect(store.getState().app.httpStatus).toBe(404);
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
    });

    it('should receive 403 unless owning the card', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest));
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(
        updateTaskCard({ ...payload, id: cardOfOtherUser.id })
      );

      expect(updateTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(store.getState().app.httpStatus).toBe(403);
    });
  });

  describe('Fulfilled', () => {
    const getCardState = () => {
      const board = store.getState().boards.docs[payload.boardId];
      const list = board.lists.find((list) => list.id === payload.listId);
      const card = list?.cards.find((card) => card.id === payload.id);
      return card;
    };

    it('should update the card after fetching the parent board', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );

      const before = getCardState();
      expect(before?.title).not.toEqual(payload.title);
      expect(before?.content).not.toEqual(payload.content);
      expect(before?.done).not.toEqual(payload.done);

      const response = await store.dispatch(updateTaskCard(payload));
      expect(updateTaskCard.fulfilled.match(response)).toBeTruthy();
      if (updateTaskCard.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(payload.title);
      expect(response.payload.data.content).toEqual(payload.content);

      const after = getCardState();
      expect(after?.id).toEqual(payload.id);
      expect(after?.title).toEqual(payload.title);
      expect(after?.content).toEqual(payload.content);
      expect(after?.deadline).not.toEqual(before?.deadline);
      expect(after?.done).toEqual(payload.done);
      expect(after?.updatedAt).not.toEqual(before?.updatedAt);
    });
  });
});

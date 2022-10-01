import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import { createTaskCard, CreateTaskCardRequest } from 'store/thunks/cards';
import { fetchTaskBoard } from 'store/thunks/boards';
import { generateRandomString } from 'utils/generator';
import { initializeStore, store } from 'mocks/store';
import {
  getFlashState,
  getUserState,
  isSignedIn,
} from 'mocks/utils/store/auth';
import { isLoading } from 'mocks/utils/store/boards';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import {
  boardOfGuestUser,
  guestUser,
  listOfGuestUser,
  unverifiedUser,
} from 'mocks/data';

describe('Thunk creating a new task card', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const requestBody: CreateTaskCardRequest = {
    title: generateRandomString(20),
    content: generateRandomString(255),
    deadline: new Date(),
    done: true,
  };

  const payload: { boardId: string; listId: string } & CreateTaskCardRequest = {
    boardId: listOfGuestUser.boardId,
    listId: listOfGuestUser.id,
    ...requestBody,
  };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should receive an error without a session', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      store.dispatch(signIn());
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)).toBeFalsy();
      const response = await store.dispatch(createTaskCard(payload));

      expect(createTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive an error without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(createTaskCard(payload));

      expect(createTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(419);
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
      const response = await store.dispatch(createTaskCard(payload));

      expect(createTaskCard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(getFlashState(store).slice(-1)[0]).toEqual({
        type: 'error',
        message: '不正なリクエストです',
      });
    });
  });

  describe('Fulfilled', () => {
    const getCardsState = () => {
      const board = store.getState().boards.docs[payload.boardId];
      const list = board.lists.find((list) => list.id === payload.listId);
      const cards = list?.cards;
      return cards;
    };

    it('should create a new card with the parent existing', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );
      const response = await store.dispatch(createTaskCard(payload));

      expect(createTaskCard.fulfilled.match(response)).toBeTruthy();
      if (createTaskCard.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(payload.title);
      expect(response.payload.data.content).toEqual(payload.content);

      const lastCard = getCardsState()?.slice(-1)[0];
      expect(lastCard?.title).toEqual(payload.title);
      expect(lastCard?.content).toEqual(payload.content);
      expect(JSON.stringify(lastCard?.deadline)).toEqual(
        JSON.stringify(payload.deadline)
      );
      expect(lastCard?.done).toEqual(payload.done);
    });
  });
});

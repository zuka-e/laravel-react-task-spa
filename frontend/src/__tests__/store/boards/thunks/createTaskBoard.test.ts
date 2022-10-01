import { GUEST_EMAIL, GUEST_PASSWORD } from 'config/app';
import { signIn } from 'store/slices/authSlice';
import { SignInRequest, signInWithEmail } from 'store/thunks/auth';
import { createTaskBoard, CreateTaskBoardRequest } from 'store/thunks/boards';
import { generateRandomString } from 'utils/generator';
import { initializeStore, store } from 'mocks/store';
import { getUserState, isSignedIn } from 'mocks/utils/store/auth';
import { isLoading } from 'mocks/utils/store/boards';
import { CSRF_TOKEN } from 'mocks/utils/validation';
import { guestUser, unverifiedUser } from 'mocks/data';

describe('Thunk creating a new task board', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const input: CreateTaskBoardRequest = {
    title: generateRandomString(20),
    description: generateRandomString(255),
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
      const response = await store.dispatch(createTaskBoard(input));

      expect(createTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive an error without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(createTaskBoard(input));

      expect(createTaskBoard.rejected.match(response)).toBeTruthy();
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
      const response = await store.dispatch(createTaskBoard(input));

      expect(createTaskBoard.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(store.getState().app.httpStatus).toBe(403);
    });
  });

  describe('Fulfilled', () => {
    it('should create a new board', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      const response = await store.dispatch(createTaskBoard(input));

      expect(createTaskBoard.fulfilled.match(response)).toBeTruthy();
      if (createTaskBoard.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(input.title);
      expect(response.payload.data.description).toEqual(input.description);
      const lastBoard = store.getState().boards.data.slice(-1)[0];
      expect(lastBoard.title).toEqual(input.title);
      expect(lastBoard.description).toEqual(input.description);
    });
  });
});

import { rest } from 'msw';

import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import {
  X_XSRF_TOKEN,
  hasValidToken,
  getUserFromSession,
} from 'mocks/utils/validation';
import { taskBoardController } from 'mocks/controllers';
import {
  CreateTaskBoardRequest,
  CreateTaskBoardResponse,
  DestroyTaskBoardRequest,
  DestroyTaskBoardResponse,
  UpdateTaskBoardRequest,
  UpdateTaskBoardResponse,
} from 'store/thunks/boards';

export const handlers = [
  rest.get(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const response = taskBoardController.index(req);

      return res(ctx.status(200), ctx.json(response));
    }
  ),

  rest.post<CreateTaskBoardRequest, CreateTaskBoardResponse>(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const response = taskBoardController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.get(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards', ':boardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const board = taskBoardController.show(req);

      if (!board) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: board }));
    }
  ),

  rest.patch<UpdateTaskBoardRequest, UpdateTaskBoardResponse>(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards', ':boardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const newState = taskBoardController.update(req);

      if (!newState) return res(ctx.status(404));

      return res(ctx.status(201), ctx.json({ data: newState }));
    }
  ),

  rest.delete<DestroyTaskBoardRequest, DestroyTaskBoardResponse>(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards', ':boardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const deleted = taskBoardController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

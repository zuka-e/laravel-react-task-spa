import { rest } from 'msw';

import type {
  CreateTaskBoardRequest,
  CreateTaskBoardResponse,
  DestroyTaskBoardRequest,
  DestroyTaskBoardResponse,
  FetchTaskBoardRequest,
  FetchTaskBoardResponse,
  FetchTaskBoardsRequest,
  FetchTaskBoardsResponse,
  UpdateTaskBoardRequest,
  UpdateTaskBoardResponse,
} from 'store/thunks/boards';
import type { ErrorResponse } from './types';
import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import { db } from 'mocks/models';
import { taskBoardController } from 'mocks/controllers';
import { applyMiddleware } from './utils';

type TaskBoardParams = {
  userId: string;
  boardId: string;
};

export const handlers = [
  rest.get<
    FetchTaskBoardsRequest,
    FetchTaskBoardsResponse & ErrorResponse,
    TaskBoardParams
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards']),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const response = taskBoardController.index(req);

      return res(ctx.status(200), ctx.json(response));
    }
  ),

  rest.post<
    CreateTaskBoardRequest,
    CreateTaskBoardResponse & ErrorResponse,
    TaskBoardParams
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards']),
    (req, res, ctx) => {
      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const response = taskBoardController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.get<
    FetchTaskBoardRequest,
    FetchTaskBoardResponse & ErrorResponse,
    TaskBoardParams
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, res, ctx) => {
      const board = taskBoardController.show(req);

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      if (!board) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: board }));
    }
  ),

  rest.patch<
    UpdateTaskBoardRequest,
    UpdateTaskBoardResponse & ErrorResponse,
    TaskBoardParams
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const newState = taskBoardController.update(req);

      if (!newState) return res(ctx.status(404));

      return res(ctx.status(201), ctx.json({ data: newState }));
    }
  ),

  rest.delete<
    DestroyTaskBoardRequest,
    DestroyTaskBoardResponse & ErrorResponse,
    TaskBoardParams
  >(
    API_ROUTE + makePath(['users', ':userId'], ['task-boards', ':boardId']),
    (req, res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${req.params.userId},${board?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const deleted = taskBoardController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

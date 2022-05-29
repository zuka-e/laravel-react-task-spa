import type { DefaultRequestBody } from 'msw';
import { rest } from 'msw';

import type {
  CreateTaskListRequest,
  CreateTaskListResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
  DestroyTaskListResponse,
} from 'store/thunks/lists';
import type { ErrorResponse } from './types';
import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import { db } from 'mocks/models';
import { taskListController } from 'mocks/controllers';
import { applyMiddleware } from './utils';

type TaskListParams = {
  boardId: string;
  listId: string;
};

export const handlers = [
  rest.post<
    CreateTaskListRequest,
    CreateTaskListResponse & ErrorResponse,
    TaskListParams
  >(
    API_ROUTE + makePath(['task-boards', ':boardId'], ['task-lists']),
    (req, res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const response = taskListController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<
    UpdateTaskListRequest,
    UpdateTaskListResponse & ErrorResponse,
    TaskListParams
  >(
    API_ROUTE +
      makePath(['task-boards', ':boardId'], ['task-lists', ':listId']),
    (req, res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId},${list?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const updated = taskListController.update(req);

      if (!updated) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<
    DefaultRequestBody,
    DestroyTaskListResponse & ErrorResponse,
    TaskListParams
  >(
    API_ROUTE +
      makePath(['task-boards', ':boardId'], ['task-lists', ':listId']),
    (req, res, ctx) => {
      const board = db.where('taskBoards', 'id', req.params.boardId)[0];
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${board?.userId},${list?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const deleted = taskListController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

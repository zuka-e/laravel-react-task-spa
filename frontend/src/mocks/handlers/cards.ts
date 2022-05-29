import type { DefaultRequestBody } from 'msw';
import { rest } from 'msw';

import type {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
  DestroyTaskCardResponse,
} from 'store/thunks/cards';
import type { ErrorResponse } from './types';
import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import { db } from 'mocks/models';
import { taskCardController } from 'mocks/controllers';
import { applyMiddleware } from './utils';

type TaskCardParams = {
  listId: string;
  cardId: string;
};

export const handlers = [
  rest.post<
    CreateTaskCardRequest,
    CreateTaskCardResponse & ErrorResponse,
    TaskCardParams
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards']),
    (req, res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const response = taskCardController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<
    UpdateTaskCardRequest,
    UpdateTaskCardResponse & ErrorResponse,
    TaskCardParams
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards', ':cardId']),
    (req, res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const card = db.where('taskCards', 'id', req.params.cardId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId},${card?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const updated = taskCardController.update(req);

      if (!updated) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<
    DefaultRequestBody,
    DestroyTaskCardResponse & ErrorResponse,
    TaskCardParams
  >(
    API_ROUTE + makePath(['task-lists', ':listId'], ['task-cards', ':cardId']),
    (req, res, ctx) => {
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const card = db.where('taskCards', 'id', req.params.cardId)[0];

      const httpException = applyMiddleware(req, [
        'authenticate',
        `authorize:${list?.userId},${card?.userId}`,
        'verified',
      ]);
      if (httpException) return res(httpException);

      const deleted = taskCardController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

import { DefaultRequestBody, rest } from 'msw';

import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import {
  CreateTaskCardRequest,
  CreateTaskCardResponse,
  UpdateTaskCardRequest,
  UpdateTaskCardResponse,
  DestroyTaskCardResponse,
} from 'store/thunks/cards';
import { db } from 'mocks/models';
import {
  X_XSRF_TOKEN,
  hasValidToken,
  getUserFromSession,
} from 'mocks/utils/validation';
import { taskCardController } from 'mocks/controllers';

type TaskCardParams = {
  listId: string;
  cardId: string;
};

export const handlers = [
  rest.post<CreateTaskCardRequest, CreateTaskCardResponse, TaskCardParams>(
    API_ROUTE + makePath(['task_lists', ':listId'], ['task_cards']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const board = db.where('taskBoards', 'id', list.boardId)[0];
      const belongsTo = { list, board };

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== belongsTo.board.userId)
        return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const response = taskCardController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<UpdateTaskCardRequest, UpdateTaskCardResponse, TaskCardParams>(
    API_ROUTE + makePath(['task_lists', ':listId'], ['task_cards', ':cardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const board = db.where('taskBoards', 'id', list?.boardId)[0];
      const belongsTo = { list, board };
      const target = db.where('taskCards', 'id', req.params.cardId)[0];

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (!belongsTo.list) return res(ctx.status(404));

      if (belongsTo.board.userId !== currentUser.id)
        return res(ctx.status(403));

      if (!target) return res(ctx.status(404));

      if (target.listId !== req.params.listId) return res(ctx.status(403));

      const updated = taskCardController.update(req);

      if (!updated) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<DefaultRequestBody, DestroyTaskCardResponse, TaskCardParams>(
    API_ROUTE + makePath(['task_lists', ':listId'], ['task_cards', ':cardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const list = db.where('taskLists', 'id', req.params.listId)[0];
      const board = db.where('taskBoards', 'id', list?.boardId)[0];
      const belongsTo = { list, board };
      const target = db.where('taskCards', 'id', req.params.cardId)[0];

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (!belongsTo.list) return res(ctx.status(404));

      if (belongsTo.board.userId !== currentUser.id)
        return res(ctx.status(403));

      if (!target) return res(ctx.status(404));

      if (target.listId !== req.params.listId) return res(ctx.status(403));

      const deleted = taskCardController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

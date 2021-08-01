import { DefaultRequestBody, rest } from 'msw';

import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import {
  CreateTaskListRequest,
  CreateTaskListResponse,
  UpdateTaskListRequest,
  UpdateTaskListResponse,
  DestroyTaskListResponse,
} from 'store/thunks/lists';
import { db } from 'mocks/models';
import {
  X_XSRF_TOKEN,
  hasValidToken,
  getUserFromSession,
} from 'mocks/utils/validation';
import { taskListController } from 'mocks/controllers';

type TaskListParams = {
  boardId: string;
  listId: string;
};

export const handlers = [
  rest.post<CreateTaskListRequest, CreateTaskListResponse, TaskListParams>(
    API_ROUTE + makePath(['task_boards', ':boardId'], ['task_lists']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const belongsTo = {
        board: db.where('taskBoards', 'id', req.params.boardId)[0],
      };

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== belongsTo.board.userId)
        return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const response = taskListController.store(req);

      return res(ctx.status(201), ctx.json({ data: response }));
    }
  ),

  rest.patch<UpdateTaskListRequest, UpdateTaskListResponse, TaskListParams>(
    API_ROUTE +
      makePath(['task_boards', ':boardId'], ['task_lists', ':listId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const belongsTo = {
        board: db.where('taskBoards', 'id', req.params.boardId)[0],
      };
      const target = db.where('taskLists', 'id', req.params.listId)[0];

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (!belongsTo.board) return res(ctx.status(404));

      if (belongsTo.board.userId !== currentUser.id)
        return res(ctx.status(403));

      if (!target) return res(ctx.status(404));

      if (target.boardId !== req.params.boardId) return res(ctx.status(403));

      const updated = taskListController.update(req);

      if (!updated) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: updated }));
    }
  ),

  rest.delete<DefaultRequestBody, DestroyTaskListResponse, TaskListParams>(
    API_ROUTE +
      makePath(['task_boards', ':boardId'], ['task_lists', ':listId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);
      const belongsTo = {
        board: db.where('taskBoards', 'id', req.params.boardId)[0],
      };
      const target = db.where('taskLists', 'id', req.params.listId)[0];

      if (!currentUser) return res(ctx.status(401));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (!belongsTo.board) return res(ctx.status(404));

      if (belongsTo.board.userId !== currentUser.id)
        return res(ctx.status(403));

      if (!target) return res(ctx.status(404));

      if (target.boardId !== req.params.boardId) return res(ctx.status(403));

      const deleted = taskListController.destroy(req);

      if (!deleted) return res(ctx.status(404));

      return res(ctx.status(200), ctx.json({ data: deleted }));
    }
  ),
];

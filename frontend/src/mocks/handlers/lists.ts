import { rest } from 'msw';

import { API_ROUTE } from 'config/api';
import { makePath } from 'utils/api';
import {
  CreateTaskListRequest,
  CreateTaskListResponse,
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
];

import { rest } from 'msw';

import { API_ROUTE } from 'config/api';
import {
  X_XSRF_TOKEN,
  hasValidToken,
  getUserFromSession,
} from 'mocks/utils/validation';
import { taskBoardController } from 'mocks/controllers';
import { makePath } from 'mocks/utils/route';

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

  rest.get(
    API_ROUTE + makePath(['users', ':userId'], ['task_boards', ':boardId']),
    (req, res, ctx) => {
      const currentUser = getUserFromSession(req.cookies.session_id);
      const token = req.headers.get(X_XSRF_TOKEN);

      if (!currentUser) return res(ctx.status(401));

      if (!currentUser.emailVerifiedAt) return res(ctx.status(403));

      if (currentUser.id !== req.params.userId) return res(ctx.status(403));

      if (!token || !hasValidToken(token)) return res(ctx.status(419));

      const response = {
        data: taskBoardController.show(req),
      };

      return res(ctx.status(200), ctx.json(response));
    }
  ),
];

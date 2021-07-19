import { RestRequest } from 'msw';

import { db } from 'mocks/models';
import { paginate } from 'mocks/utils/paginate';

export const index = (req: RestRequest) => {
  const boards = db.where('taskBoards', 'userId', req.params.userId);
  const response = paginate({ req: req, allData: boards });

  return response;
};

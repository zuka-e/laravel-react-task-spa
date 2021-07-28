import { RestRequest } from 'msw';

import { TaskList } from 'models';
import { CreateTaskListRequest } from 'store/thunks/lists';
import { db, TaskListDocument } from 'mocks/models';

export const index = (req: RestRequest) => {};

export const store = (req: RestRequest<CreateTaskListRequest>) => {
  const newList = db.create('taskLists', {
    ...({} as TaskListDocument),
    boardId: req.params.boardId,
    ...req.body,
  });

  const response: TaskList = { ...newList, cards: [] };

  return response;
};

export const show = (req: RestRequest) => {};

export const update = (req: RestRequest) => {};

export const destroy = (req: RestRequest) => {};

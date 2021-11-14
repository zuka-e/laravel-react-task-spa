import { RestRequest } from 'msw';

import { TaskCard } from 'models';
import {
  CreateTaskCardRequest,
  UpdateTaskCardRequest,
} from 'store/thunks/cards';
import { db, TaskCardDocument } from 'mocks/models';

export const index = (req: RestRequest) => {};

export const store = (req: RestRequest<CreateTaskCardRequest>) => {
  const parent = db.where('taskLists', 'id', req.params.listId)[0];
  const newCard = db.create('taskCards', {
    ...({} as TaskCardDocument),
    listId: req.params.listId,
    ...req.body,
  });

  const response: TaskCard = { ...newCard, boardId: parent.boardId };

  return response;
};

export const show = (req: RestRequest) => {};

export const update = (req: RestRequest<UpdateTaskCardRequest>) => {
  const card = db.where('taskCards', 'id', req.params.cardId)[0];

  if (!card) return;

  const updated = db.update('taskCards', { ...card, ...req.body });

  const parent = db.where('taskLists', 'id', req.params.listId)[0];
  const boardId = parent.boardId;
  const response: TaskCard = { ...updated, boardId };

  return response;
};

export const destroy = (req: RestRequest) => {
  const deleted = db.remove('taskCards', req.params.cardId);

  if (!deleted) return;

  const parent = db.where('taskLists', 'id', req.params.listId)[0];
  const boardId = parent.boardId;
  const response: TaskCard = { ...deleted, boardId };

  return response;
};

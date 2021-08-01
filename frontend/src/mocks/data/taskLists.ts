import faker from 'faker';

import { Doc, db, TaskListDocument } from 'mocks/models';
import { uuid } from 'mocks/utils/uuid';
import { guestUser, otherUser } from './users';
import { boardOfGuestUser, boardOfOtherUser } from './taskBoards';

export const listOfGuestUser: TaskListDocument = {
  id: uuid(),
  userId: guestUser.id,
  boardId: boardOfGuestUser.id,
  title: 'ゲストユーザーのTaskList',
  description: 'ゲストユーザーが所有するTaskList',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const listOfOtherUser: TaskListDocument = {
  id: uuid(),
  userId: otherUser.id,
  boardId: boardOfOtherUser.id,
  title: '他のユーザーのTaskList',
  description: '他のユーザーが所有するTaskList',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialLists: TaskListDocument[] = [listOfGuestUser, listOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    user: Doc<'users'>;
    board: Doc<'taskBoards'>;
  };
};

const runSeeder = (props: SeederProps) => {
  const user = db.where('users', 'id', props.belongsTo.user.id)[0];
  if (!user) throw Error('The specified data does not exist');

  initialLists.forEach((list) => {
    db.create('taskLists', list);
  });

  [...Array(props.count)].forEach(() => {
    db.create('taskLists', {
      id: faker.datatype.uuid(),
      userId: props.belongsTo.user.id,
      boardId: props.belongsTo.board.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      description: faker.hacker.phrase(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  });
};

const initialize = () => {
  db.load('taskLists');

  if (db.exists('taskLists')) return;

  const guestUserBoards = db.where('taskBoards', 'userId', guestUser.id);
  guestUserBoards.forEach((board) => {
    runSeeder({ count: 2, belongsTo: { user: guestUser, board: board } });
  });

  const otherUserBoards = db.where('taskBoards', 'userId', otherUser.id);
  otherUserBoards.forEach((board) => {
    runSeeder({ count: 2, belongsTo: { user: otherUser, board: board } });
  });
};

// 初期化実行
initialize();

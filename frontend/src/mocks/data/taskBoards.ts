import faker from 'faker';

import { Doc, db, TaskBoardDocument } from 'mocks/models';
import { uuid } from 'mocks/utils/uuid';
import { guestUser, otherUser, unverifiedUser } from './users';

export const boardOfGuestUser: TaskBoardDocument = {
  id: uuid(),
  userId: guestUser.id,
  title: 'ゲストユーザーのBoard',
  description: 'ゲストユーザーが所有するTaskBoard',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const boardOfOtherUser: TaskBoardDocument = {
  id: uuid(),
  userId: otherUser.id,
  title: '他のユーザーのBoard',
  description: '他のユーザーが所有するTaskBoard',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const boardOfUnverifiedUser: TaskBoardDocument = {
  id: uuid(),
  userId: unverifiedUser.id,
  title: '未認証ユーザーのBoard',
  description: '未認証ユーザーが所有するTaskBoard',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialBoards: TaskBoardDocument[] = [
  boardOfGuestUser,
  boardOfOtherUser,
  boardOfUnverifiedUser,
];

type SeederProps = {
  count: number;
  belongsTo: { user: Doc<'users'> };
};

const runSeeder = (props: SeederProps) => {
  const user = db.where('users', 'id', props.belongsTo.user.id)[0];
  if (!user) throw Error('The specified data does not exist');

  initialBoards.forEach((board) => {
    db.create('taskBoards', board);
  });

  [...Array(props.count)].forEach(() => {
    db.create('taskBoards', {
      userId: user.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      description: faker.hacker.phrase(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  });
};

const initialize = () => {
  db.load('taskBoards');

  if (db.exists('taskBoards')) return;

  runSeeder({ count: 30, belongsTo: { user: guestUser } });
  runSeeder({ count: 1, belongsTo: { user: otherUser } });
};

// 初期化実行
initialize();

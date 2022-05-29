import faker from 'faker';

import { Doc, db, TaskCardDocument } from 'mocks/models';
import { uuid } from 'mocks/utils/uuid';
import { guestUser, otherUser } from './users';
import { listOfGuestUser, listOfOtherUser } from './taskLists';

export const cardOfGuestUser: TaskCardDocument = {
  id: uuid(),
  userId: guestUser.id,
  listId: listOfGuestUser.id,
  title: 'ゲストユーザーのTaskCard',
  content: 'ゲストユーザーが所有するTaskCard',
  deadline: new Date(),
  done: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const cardOfOtherUser: TaskCardDocument = {
  id: uuid(),
  userId: otherUser.id,
  listId: listOfOtherUser.id,
  title: '他のユーザーのTaskCard',
  content: '他のユーザーが所有するTaskCard',
  deadline: new Date(),
  done: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const initialCards: TaskCardDocument[] = [cardOfGuestUser, cardOfOtherUser];

type SeederProps = {
  count: number;
  belongsTo: {
    user: Doc<'users'>;
    list: Doc<'taskLists'>;
  };
};

const runSeeder = (props: SeederProps) => {
  const user = db.where('users', 'id', props.belongsTo.user.id)[0];
  if (!user) throw Error('The specified data does not exist');

  initialCards.forEach((card) => {
    db.create('taskCards', card);
  });

  [...Array(props.count)].forEach(() => {
    db.create('taskCards', {
      id: faker.datatype.uuid(),
      userId: props.belongsTo.user.id,
      listId: props.belongsTo.list.id,
      title: `${faker.hacker.adjective()} ${faker.hacker.verb()}`,
      content: faker.hacker.phrase(),
      done: Math.floor(Math.random() * 10) % 3 === 0,
      deadline: faker.date.future(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  });
};

const initialize = () => {
  db.load('taskCards');

  if (db.exists('taskCards')) return;

  const guestUserBoards = db.where('taskBoards', 'userId', guestUser.id);
  guestUserBoards.forEach((board) => {
    const guestUserLists = db.where('taskLists', 'boardId', board.id);
    guestUserLists.forEach((list) => {
      runSeeder({ count: 2, belongsTo: { user: guestUser, list: list } });
    });
  });

  const otherUserBoards = db.where('taskBoards', 'userId', otherUser.id);
  otherUserBoards.forEach((board) => {
    const otherUserLists = db.where('taskLists', 'boardId', board.id);
    otherUserLists.forEach((list) => {
      runSeeder({ count: 2, belongsTo: { user: otherUser, list: list } });
    });
  });
};

// 初期化実行
initialize();

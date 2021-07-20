import faker from 'faker';

import { Doc, db } from 'mocks/models';
import { guestUser, otherUser } from './users';

type SeederProps = {
  count: number;
  belongsTo: { user: Doc<'users'> };
};

const runSeeder = (props: SeederProps) => {
  const user = db.where('users', 'id', props.belongsTo.user.id)[0];
  if (!user) throw Error('The specified data does not exist');

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

  runSeeder({ count: 2, belongsTo: { user: guestUser } });
  runSeeder({ count: 1, belongsTo: { user: otherUser } });
};

// 初期化実行
initialize();

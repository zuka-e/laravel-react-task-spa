import { users } from 'mocks/models/users';

export const hasValidToken = (requestToken: string) => {
  const sessionToken = sessionStorage.getItem('token');
  return requestToken === sessionToken;
};

export const isUniqueEmail = (email: string) =>
  users.filter((user) => user.email === email).length === 0;

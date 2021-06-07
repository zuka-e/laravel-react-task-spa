import { generateRandomString } from '.';

export const makeEmail = () => {
  const username = generateRandomString() + generateRandomString();
  const domain = 'example.com';
  const email = username + '@' + domain;
  return email;
};

export const generateRandomString = () =>
  Math.random().toString(36).substring(2, 15);

export const makeEmail = () => {
  const username = generateRandomString() + generateRandomString();
  const domain = 'example.com';
  const email = username + '@' + domain;
  return email;
};

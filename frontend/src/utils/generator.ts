export const generateRandomString = (length?: number) => {
  const alphabet = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
  };
  const decimal = '0123456789';
  const chars = alphabet.uppercase + alphabet.lowercase + decimal;

  const num = length || 12;
  let result = '';
  for (let i = 0; i < num; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const makeEmail = () => {
  const username = generateRandomString() + generateRandomString();
  const domain = 'example.com';
  const email = username + '@' + domain;
  return email;
};

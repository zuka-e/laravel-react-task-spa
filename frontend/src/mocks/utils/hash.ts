import crypt from 'crypto';

export const digestText = (text: string) => {
  const hashHex = crypt.createHash('sha256').update(text).digest('hex');
  return hashHex;
};

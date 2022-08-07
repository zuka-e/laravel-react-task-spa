import crypto from 'crypto';

const password = process.env.NEXT_PUBLIC_APP_KEY || 'password'.repeat(4);
const salt = crypto.randomBytes(128); // at least 16B recommended
const key =
  process.env.NODE_ENV === 'test'
    ? crypto.scryptSync(password, salt, 32)
    : Buffer.from(password);

const iv = 'iv'.repeat(8); // lenght is 16, if AES
const algorithm = 'aes-256-cbc';

export const encrypt = (text: string) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const decrypt = (text: string) => {
  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const digestText = (text: string) => {
  const hashHex = crypto.createHash('sha256').update(text).digest('hex');
  return hashHex;
};

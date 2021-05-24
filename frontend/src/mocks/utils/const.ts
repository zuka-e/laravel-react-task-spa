export const GUEST_NAME = process.env.REACT_APP_GUEST_NAME || '';
export const GUEST_EMAIL = process.env.REACT_APP_GUEST_EMAIL || '';
export const GUEST_PASSWORD = process.env.REACT_APP_GUEST_PASSWORD || '';

if (!GUEST_NAME || !GUEST_EMAIL || !GUEST_PASSWORD)
  throw Error('environment variables about a guest is missing');

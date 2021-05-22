export const GUEST_EMAIL = process.env.REACT_APP_GUEST_EMAIL || '';
export const GUEST_PASSWORD = process.env.REACT_APP_GUEST_PASSWORD || '';

if (!GUEST_EMAIL || !GUEST_PASSWORD)
  throw Error('GUEST_EMAIL or GUEST_EMAIL is missing');

export const APP_NAME = process.env.REACT_APP_APP_NAME || '';

export const GUEST_NAME = process.env.REACT_APP_GUEST_NAME || '';
export const GUEST_EMAIL = process.env.REACT_APP_GUEST_EMAIL || '';
export const GUEST_PASSWORD = process.env.REACT_APP_GUEST_PASSWORD || '';

if (!APP_NAME) throw Error('environment variables required');

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '';

export const GUEST_NAME = process.env.NEXT_PUBLIC_GUEST_NAME || '';
export const GUEST_EMAIL = process.env.NEXT_PUBLIC_GUEST_EMAIL || '';
export const GUEST_PASSWORD = process.env.NEXT_PUBLIC_GUEST_PASSWORD || '';

if (!APP_NAME) throw Error('environment variables required');

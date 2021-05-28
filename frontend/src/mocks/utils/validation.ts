export const CSRF_TOKEN = 'csrf-token'; // session
export const XSRF_TOKEN = 'XSRF-TOKEN'; // cookie
export const X_XSRF_TOKEN = 'X-XSRF-TOKEN'; // header

export const hasValidToken = (requestToken: string) => {
  const sessionToken = sessionStorage.getItem(CSRF_TOKEN);
  return requestToken === sessionToken;
};

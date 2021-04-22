export const APP_NAME = process.env.REACT_APP_APP_NAME || 'App';

// 注: 相互依存 (相互にimport) で以下のエラー発生
// TypeError: Cannot read property 'reducer' of undefined
export const sessionStorageKeys = {
  SIGNED_IN: 'SIGNED_IN',
} as const;

export const sessionStorageValues = {
  TRUE: 'TRUE',
  FALSE: 'FALSE',
} as const;

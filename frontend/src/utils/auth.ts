import store from '../store';
import { fetchSignInState, signIn, signOut } from '../store/slices/authSlice';
import { sessionStorageKeys, sessionStorageValues } from '../config/app';

export const isSignedIn = () => {
  const { SIGNED_IN } = sessionStorageKeys;
  const { TRUE } = sessionStorageValues;
  return !!(sessionStorage.getItem(SIGNED_IN) === TRUE);
};

export const initializeAuthState = () => {
  const { SIGNED_IN } = sessionStorageKeys;
  const { TRUE, FALSE } = sessionStorageValues;
  // session (ブラウザ) 開始時はデータ不存在
  // ->  初回のみサーバーの認証状態を問い合わせ
  if (!!!sessionStorage.getItem(SIGNED_IN)) {
    store.dispatch(fetchSignInState());
  }
  // 取得した`sessionStorage`の値で`store`も更新
  if (sessionStorage.getItem(SIGNED_IN) === TRUE) store.dispatch(signIn());
  if (sessionStorage.getItem(SIGNED_IN) === FALSE) store.dispatch(signOut());

  // `sessionStorage`でログイン状態を示すが、サーバーの認証切れの可能性あり
  // -> その確認は`apiClient.interceptors`で行う
};

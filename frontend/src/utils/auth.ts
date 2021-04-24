import store from '../store';
import { fetchSignInState } from '../store/slices/authSlice';
import { sessionStorageKeys, sessionStorageValues } from './const';

export const isSignedIn = () => {
  return store.getState().auth.signedIn;
};

// store`signedIn`更新時に実行すること -> `useEffect`
export const initializeAuthState = () => {
  const { SIGNED_IN } = sessionStorageKeys;
  const { TRUE, FALSE } = sessionStorageValues;

  // session (ブラウザ) 開始時は`sessionStorage`不存在 -> false
  // ->  初回のみサーバーの認証状態を問い合わせ
  if (isSignedIn() === undefined || !!!sessionStorage.getItem(SIGNED_IN)) {
    store.dispatch(fetchSignInState());
  }
  // 更新した`store`の値で`sessionStorage`も更新
  const signedIn = isSignedIn() ? TRUE : FALSE;
  sessionStorage.setItem(SIGNED_IN, signedIn);

  // ブラウザでのログイン状態を示すが、サーバー側で認証切れの可能性あり
  // -> その確認は`apiClient.interceptors`で行う
};

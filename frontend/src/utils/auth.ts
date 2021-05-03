import store from '../store';
import { fetchSignInState, signIn, signOut } from '../store/slices/authSlice';
import { localStorageKeys, localStorageValues } from './const';

export const isReady = () => {
  return store.getState().auth.signedIn !== undefined;
};

export const isSignedIn = () => {
  return store.getState().auth.signedIn;
};

export const isSentEmail = () => {
  return store.getState().auth.sentEmail;
};

export const isVerified = () => {
  return !!store.getState().auth.user?.emailVerifiedAt;
};

// store`signedIn`更新時に実行すること -> `useEffect`
export const initializeAuthState = () => {
  const { SIGNED_IN } = localStorageKeys;
  const { TRUE, FALSE } = localStorageValues;

  // 初回 (session開始時) のみサーバーの認証状態を問い合わせ
  if (isSignedIn() === undefined) {
    // `undefined`: 初期値, リロード時など
    switch (localStorage.getItem(SIGNED_IN)) {
      case TRUE:
        store.dispatch(signIn());
        break;
      case FALSE:
        store.dispatch(signOut());
        break;
      case null: // 新規タブ、ウィンドウ
        store.dispatch(fetchSignInState());
    }
  }
  // (case null:) 更新した`store`の値で`localStorage`も更新
  const signedIn = isSignedIn() ? TRUE : FALSE;
  localStorage.setItem(SIGNED_IN, signedIn);

  // ブラウザでのログイン状態を示すが、サーバー側で認証切れの可能性あり
  // -> その確認は`apiClient.interceptors`で行う
};
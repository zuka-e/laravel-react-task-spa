import { useEffect } from 'react';

import { User } from 'models/User';
import { fetchAuthUser } from 'store/thunks/auth';
import { useAppDispatch, useAppSelector } from '.';

// `user`更新、取得、存在確認用
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // store.user の値を更新
  useEffect(() => {
    dispatch(fetchAuthUser());
  }, [dispatch]);

  // `null`,`undefined`を排除 (使用時は`isAuthReady`で検証)
  const currentUser = user as User;

  // 初期値: `undefined`, ログアウト時など: `null`
  const isAuthReady = () => !!currentUser;

  return { currentUser, isAuthReady };
};

export default useAuth;

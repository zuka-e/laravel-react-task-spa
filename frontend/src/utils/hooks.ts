import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '../models/User';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAuthUser } from '../store/slices/authSlice';

// クエリパラメータ用カスタムフック
export const useQuery = () => new URLSearchParams(useLocation().search);

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

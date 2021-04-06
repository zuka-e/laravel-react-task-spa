import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from './';
import { RootState } from './rootReducer';

// `useDispatch`使用時、'middleware'(Redux Thunkを含む)を適用する
export const useAppDispatch = () => useDispatch<AppDispatch>();
// `useSelector`使用時、`(state: RootState)`を毎回入力する必要をなくす
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

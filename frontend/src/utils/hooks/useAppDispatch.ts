import { useDispatch } from 'react-redux';

import type { AppDispatch } from 'store';

// `useDispatch`使用時、'middleware'(Redux Thunkを含む)を適用する
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default useAppDispatch;

import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from 'store';

// `useSelector`使用時、`(state: RootState)`を毎回入力する必要をなくす
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;

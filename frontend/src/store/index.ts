import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

// 'rootReducer'に設定したものを'store'として利用
const store = configureStore({
  reducer: rootReducer,
});
export type AppDispatch = typeof store.dispatch;

// ThunkAction<戻り値, 'getState'のタイプ, 追加の引数, 許容Actionタイプ> を設定
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export default store;

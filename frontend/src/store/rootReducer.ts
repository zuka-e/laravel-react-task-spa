import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  // ex. tasks: tasksSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

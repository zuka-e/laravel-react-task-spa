import store from 'store';
import { InfoBoxProps } from 'store/slices/taskBoardSlice';

export const isSelected = (data: InfoBoxProps['data']) =>
  store.getState().boards.infoBox.data?.id === data?.id;

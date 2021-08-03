import React, { Dispatch, useReducer, useEffect } from 'react';

import produce from 'immer';

import { TaskList } from 'models';
import { useDeepEqualSelector } from 'utils/hooks';

export const draggableItem = {
  card: 'card',
};

export type DragItem = {
  type: string;
  index: number;
  listIndex: number;
  id: string;
};

// State
type DragState = {
  sorting: boolean;
  lists: TaskList[];
};

// Action
const INIT = 'INIT';
const DRAG_START = 'DRAG_START';
const DRAG_END = 'DRAG_END';
const DRAG_CANCEL = 'DRAG_CANCEL';
const MOVE_CARD = 'MOVE_CARD';

type InitAction = {
  type: typeof INIT;
  payload: TaskList[];
};
type DragStartAction = {
  type: typeof DRAG_START;
};
type DragEndAction = {
  type: typeof DRAG_END;
};
type DragCancelAction = {
  type: typeof DRAG_CANCEL;
  payload: { initialLists: TaskList[] };
};
type MoveCardAction = {
  type: typeof MOVE_CARD;
  payload: {
    dragListIndex: number;
    hoverListIndex: number;
    dragIndex: number;
    hoverIndex: number;
    boardId: string;
  };
};
type DragActionTypes =
  | InitAction
  | DragStartAction
  | DragEndAction
  | DragCancelAction
  | MoveCardAction;

// Reducer
const init = (state: DragState): DragState => {
  return { ...state, lists: state.lists };
};
const reducer = (state: DragState, action: DragActionTypes): DragState => {
  switch (action.type) {
    case INIT:
      return init({ ...state, lists: action.payload });
    case DRAG_START:
      return { ...state, sorting: true };
    case DRAG_END:
      return { ...state, sorting: false };
    case DRAG_CANCEL:
      return {
        ...state,
        sorting: false,
        lists: action.payload.initialLists,
      };
    case MOVE_CARD:
      return produce(state, (draft) => {
        const {
          dragListIndex,
          hoverListIndex,
          dragIndex,
          hoverIndex,
          boardId,
        } = action.payload;
        const sortedLists = draft.lists.filter(
          (list) => list.boardId === boardId
        );
        const dragged = sortedLists[dragListIndex].cards[dragIndex];
        sortedLists[dragListIndex].cards.splice(dragIndex, 1);
        sortedLists[hoverListIndex].cards.splice(hoverIndex, 0, dragged);
      });
    default:
      return state;
  }
};

// 下位コンポーネントに渡す値
type DragContextProps = {
  state: DragState;
  dragDispatch: Dispatch<DragActionTypes>;
};

export const DragContext = React.createContext<DragContextProps>(
  {} as DragContextProps
);

type DragStateProviderProps = {
  boardId: string;
};

const DragStateProvider: React.FC<DragStateProviderProps> = (props) => {
  const initialLists = useDeepEqualSelector(
    (state) => state.boards.docs[props.boardId].lists
  );

  const initialState: DragState = {
    sorting: false,
    lists: initialLists,
  };

  const [state, dragDispatch] = useReducer(reducer, initialState, init);

  // 都度`store`の変更を反映
  useEffect(() => {
    dragDispatch({ type: 'INIT', payload: initialLists });
  }, [initialLists]);

  return (
    <DragContext.Provider value={{ state, dragDispatch }}>
      {props.children}
    </DragContext.Provider>
  );
};

export default DragStateProvider;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TaskBoard, TaskBoardsCollection, TaskCard, TaskList } from 'models';
import { makeDocsWithIndex } from 'utils/dnd';
import {
  FetchTaskBoardsResponse,
  fetchTaskBoards,
  fetchTaskBoard,
  createTaskBoard,
  updateTaskBoard,
  destroyTaskBoard,
} from 'store/thunks/boards';
import {
  createTaskList,
  updateTaskList,
  destroyTaskList,
} from 'store/thunks/lists';
import {
  createTaskCard,
  updateTaskCard,
  destroyTaskCard,
} from 'store/thunks/cards';
import { updateTaskCardRelationships } from 'store/thunks/cards/updateTaskCardRelationships';

export type FormAction =
  | { method: 'POST'; type: 'board' }
  | { method: 'POST'; type: 'list'; parent: TaskBoard }
  | { method: 'POST'; type: 'card'; parent: TaskList }
  | { method: 'PATCH'; type: 'board'; data: TaskBoard }
  | { method: 'PATCH'; type: 'list'; data: TaskList }
  | { method: 'PATCH'; type: 'card'; data: TaskCard };

export type DeleteAction =
  | { type: 'board'; data: TaskBoard }
  | { type: 'list'; data: TaskList }
  | { type: 'card'; data: TaskCard };

type MoveCardAction = {
  dragListIndex: number;
  hoverListIndex: number;
  dragIndex: number;
  hoverIndex: number;
  boardId: string;
  listId?: string;
};

type InfoBoxAction =
  | { type: 'board'; data: TaskBoard }
  | { type: 'list'; data: TaskList }
  | { type: 'card'; data: TaskCard };

type InfoBoxState = { open: boolean } & InfoBoxAction;

type TaskBoardState = {
  loading: boolean;
  infoBox: InfoBoxState;
  docs: TaskBoardsCollection;
} & FetchTaskBoardsResponse;

const initialState = {
  loading: false,
  infoBox: {} as InfoBoxState,
  docs: {},
  data: [],
  links: {} as TaskBoardState['links'],
  meta: {} as TaskBoardState['meta'],
} as TaskBoardState;

export const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    openInfoBox(state, action: PayloadAction<InfoBoxAction>) {
      state.infoBox.open = true;
      state.infoBox.type = action.payload.type;
      state.infoBox.data = action.payload.data;
    },
    closeInfoBox(state) {
      state.infoBox.open = false;
    },
    removeInfoBox(state) {
      state.infoBox = initialState.infoBox;
    },
    moveCard(state, action: PayloadAction<MoveCardAction>) {
      const { dragListIndex, hoverListIndex, dragIndex, hoverIndex, boardId } =
        action.payload;

      const sortedLists = state.docs[boardId].lists;
      const dragged = sortedLists[dragListIndex].cards[dragIndex];

      if (action.payload.listId) dragged.listId = action.payload.listId;

      sortedLists[dragListIndex].cards.splice(dragIndex, 1);
      sortedLists[hoverListIndex].cards.splice(hoverIndex, 0, dragged);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTaskBoards.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(fetchTaskBoards.fulfilled, (state, action) => {
      state.data = action.payload.data || [];
      state.links = action.payload.links || {};
      state.meta = action.payload.meta || {};
      state.loading = false;
    });

    builder.addCase(fetchTaskBoards.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(fetchTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(fetchTaskBoard.fulfilled, (state, action) => {
      const docId = action.payload.data.id;

      /** `TaskBoard` */
      state.docs[docId] = action.payload.data;

      /** `TaskList` (プロパティが存在しない場合は`[]`を設定) */
      state.docs[docId].lists = state.docs[docId].lists
        ? state.docs[docId].lists
        : [];

      /** `TaskCard` (`boardId`及び`index`プロパティを設定)*/
      state.docs[docId].lists.forEach((list) => {
        if (!list.cards) {
          list.cards = [];
          return;
        }

        const cardsWithIndex = makeDocsWithIndex(
          list.cards,
          state.docs[docId].cardIndexMap
        );
        const cards = cardsWithIndex.map((card) => ({
          ...card,
          boardId: state.docs[docId].id,
        }));

        /** `index`プロパティに従って並び替え */
        list.cards = cards.slice().sort((a, b) => a.index - b.index);
      });

      state.loading = false;
    });

    builder.addCase(fetchTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(createTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(createTaskBoard.fulfilled, (state, action) => {
      const newDoc = action.payload.data;
      state.data = [...state.data, { ...newDoc }];
      state.loading = false;
    });

    builder.addCase(createTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskBoard.fulfilled, (state, action) => {
      const updatedBoard = action.payload.data;
      const currentBoard = state.data.find(
        (board) => board.id === updatedBoard.id
      );

      if (currentBoard) Object.assign(currentBoard, updatedBoard);

      state.docs[updatedBoard.id] = {
        ...state.docs[updatedBoard.id],
        ...updatedBoard,
      };

      if (updatedBoard.id === state.infoBox.data?.id)
        state.infoBox.data = updatedBoard;

      state.loading = false;
    });

    builder.addCase(updateTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(destroyTaskBoard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(destroyTaskBoard.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (board) => board.id !== action.payload.data.id
      );

      delete state.docs[action.payload.data.id];

      state.loading = false;
    });

    builder.addCase(destroyTaskBoard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(createTaskList.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(createTaskList.fulfilled, (state, action) => {
      const newList = action.payload.data;
      newList.cards = newList.cards ? newList.cards : [];
      const boardId = newList.boardId;

      state.docs[boardId].lists = [
        ...state.docs[boardId].lists,
        { ...newList },
      ];
      state.loading = false;
    });

    builder.addCase(createTaskList.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskList.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskList.fulfilled, (state, action) => {
      const boardId = action.payload.data.boardId;
      const list = state.docs[boardId].lists.find(
        (list) => list.id === action.payload.data.id
      );
      Object.assign(list, action.payload.data);

      if (list?.id === state.infoBox.data?.id) state.infoBox.data = list;

      state.loading = false;
    });

    builder.addCase(updateTaskList.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(destroyTaskList.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(destroyTaskList.fulfilled, (state, action) => {
      const boardId = action.payload.data.boardId;
      state.docs[boardId].lists = state.docs[boardId].lists.filter(
        (list) => list.id !== action.payload.data.id
      );

      if (action.payload.data.id === state.infoBox.data?.id)
        state.infoBox = initialState.infoBox;

      state.loading = false;
    });

    builder.addCase(destroyTaskList.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(createTaskCard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(createTaskCard.fulfilled, (state, action) => {
      const newCard = action.payload.data;
      const boardId = action.payload.boardId;
      const listId = newCard.listId;

      newCard.boardId = boardId;
      const list = state.docs[boardId].lists.find((list) => list.id === listId);
      list!.cards = [...list!.cards, { ...newCard }];

      state.loading = false;
    });

    builder.addCase(createTaskCard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskCard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskCard.fulfilled, (state, action) => {
      const updatedCard = action.payload.data;
      const boardId = action.payload.boardId;
      const board = state.docs[boardId];
      const list = board.lists.find((list) => list.id === updatedCard.listId);
      const currentCard = list?.cards.find(
        (card) => card.id === updatedCard.id
      );

      updatedCard.boardId = boardId;
      Object.assign(currentCard, updatedCard);

      if (updatedCard?.id === state.infoBox.data?.id)
        state.infoBox.data = updatedCard;

      state.loading = false;
    });

    builder.addCase(updateTaskCard.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskCardRelationships.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(updateTaskCardRelationships.fulfilled, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(updateTaskCardRelationships.rejected, (state, _action) => {
      state.loading = false;
    });

    builder.addCase(destroyTaskCard.pending, (state, _action) => {
      state.loading = true;
    });

    builder.addCase(destroyTaskCard.fulfilled, (state, action) => {
      const deletedCard = action.payload.data;
      const boardId = action.payload.boardId;
      const board = state.docs[boardId];
      const list = board.lists.find((list) => list.id === deletedCard.listId);

      list!.cards = list!.cards.filter((card) => card.id !== deletedCard.id);

      if (deletedCard.id === state.infoBox.data?.id)
        state.infoBox = initialState.infoBox;

      state.loading = false;
    });

    builder.addCase(destroyTaskCard.rejected, (state, _action) => {
      state.loading = false;
    });
  },
});

export const { openInfoBox, closeInfoBox, removeInfoBox, moveCard } =
  taskBoardSlice.actions;

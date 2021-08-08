import React, { useState } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

import { DocumentBase, TaskCard, TaskList } from 'models';
import { SortOperation } from 'utils/sort';
import { useAppDispatch } from 'utils/hooks';
import { sortCard, sortList } from 'store/slices/taskBoardSlice';

const options = {
  createdAtAsc: '作成日時 (昇順)',
  createdAtDesc: '作成日時 (降順)',
  updatedAtAsc: '更新日時 (昇順)',
  updatedAtDesc: '更新日時 (降順)',
  custom: 'カスタム',
} as const;

type SortOption = keyof typeof options;

type SortSelectProps =
  | { type: 'list'; boardId: TaskList['boardId'] }
  | { type: 'card'; boardId: TaskCard['boardId']; listId: TaskCard['listId'] };

const SortSelect: React.FC<SortSelectProps> = (props) => {
  const boardId = props.boardId;
  const listId = props.type === 'card' ? props.listId : undefined;
  const dispatch = useAppDispatch();
  const [currentValue, setCurrentValue] = useState<SortOption>();

  const order: Record<SortOption, SortOperation<DocumentBase>> = {
    createdAtAsc: { column: 'createdAt' },
    createdAtDesc: { column: 'createdAt', direction: 'desc' },
    updatedAtAsc: { column: 'updatedAt' },
    updatedAtDesc: { column: 'updatedAt', direction: 'desc' },
    custom: { column: 'index' },
  };

  const handleClick = (key: SortOption) => () => {
    switch (key) {
      case 'createdAtAsc':
        setCurrentValue('createdAtAsc');
        if (listId)
          dispatch(sortCard({ boardId, listId, ...order.createdAtAsc }));
        else dispatch(sortList({ boardId, ...order.createdAtAsc }));
        break;

      case 'createdAtDesc':
        setCurrentValue('createdAtDesc');
        if (listId)
          dispatch(sortCard({ boardId, listId, ...order.createdAtDesc }));
        else dispatch(sortList({ boardId, ...order.createdAtDesc }));
        break;

      case 'updatedAtAsc':
        setCurrentValue('updatedAtAsc');
        if (listId)
          dispatch(sortCard({ boardId, listId, ...order.updatedAtAsc }));
        else dispatch(sortList({ boardId, ...order.updatedAtAsc }));
        break;

      case 'updatedAtDesc':
        setCurrentValue('updatedAtDesc');
        if (listId)
          dispatch(sortCard({ boardId, listId, ...order.updatedAtDesc }));
        else dispatch(sortList({ boardId, ...order.updatedAtDesc }));
        break;

      case 'custom':
        setCurrentValue('custom');
        if (listId) dispatch(sortCard({ boardId, listId, ...order.custom }));
        else dispatch(sortList({ boardId, ...order.custom }));
        break;
    }
  };

  return (
    <List aria-label='sort-select' dense>
      {(Object.keys(options) as SortOption[]).map((option) => (
        <ListItem key={option} button onClick={handleClick(option)}>
          <ListItemText primary={options[option]} />
          {currentValue === option && (
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default SortSelect;

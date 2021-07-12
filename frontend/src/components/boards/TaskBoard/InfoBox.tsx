import React, { useEffect } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import { TaskList, TaskCard } from 'models';
import { closeInfoBox, removeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch, useDeepEqualSelector, usePrevious } from 'utils/hooks';
import {
  deactivateEventAttr,
  isIgnoredTarget,
  isItself,
  hasChanged,
} from 'utils/infoBox';
import { TaskListDetails, TaskCardDetails } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      transition: theme.transitions.create('all'),
      overflow: 'hidden',
      position: 'relative',
      width: '100%',
      maxWidth: 0,
      minWidth: 0,
      '& > .infoWrapper': {
        position: 'absolute',
        height: '100%',
        maxWidth: '100%',
        borderLeft: '1px solid ' + theme.palette.divider,
      },
    },
    open: { maxWidth: '100%' },
  })
);

const InfoBox: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const currentState = useDeepEqualSelector((state) => state.boards.infoBox);
  const previousState = usePrevious(
    currentState.type ? currentState : undefined
  );

  useEffect(() => {
    if (!previousState) return; // `open`を実行していない(`prev`が存在していない)場合
    if (currentState.open) return; // `close`されていない場合
    if (!currentState.type) return; // 既に`remove`されている場合

    /** `close`後`transition`動作を待機してから`remove` */
    const timeoutId = setTimeout(() => {
      dispatch(removeInfoBox());
    }, theme.transitions.duration.standard);

    /** Prevent memory leaks */
    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [dispatch, previousState, currentState.open, currentState.type]);

  useEffect(() => {
    return function cleanup() {
      dispatch(removeInfoBox());
    };
  }, [dispatch]);

  const renderInfoBox = () => {
    switch (currentState.type) {
      case 'board':
        return <React.Fragment />; // <TaskBoardDetails/>
      case 'list':
        return <TaskListDetails list={currentState.data as TaskList} />;
      case 'card':
        return <TaskCardDetails card={currentState.data as TaskCard} />;
    }
  };

  return (
    <div className={`${classes.root} ${currentState.open && classes.open}`}>
      {currentState.type ? (
        <Wrapper>{renderInfoBox()}</Wrapper>
      ) : (
        <h2 style={{ textAlign: 'center' }}>There is no content</h2>
      )}
    </div>
  );
};

/**
 * 要素外のクリックで`open`状態を解除する機能を付与するためのラッパー。
 */
const Wrapper: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const currentState = useDeepEqualSelector(
    (state) => state.boards.infoBox.data
  );
  const state = {
    current: currentState,
    prev: usePrevious(currentState) || currentState,
  };

  /**
   *  以下の場合`open`を解除しない
   *
   * - 自身のデータを表示する操作
   * - 別のデータを表示する操作
   * - 事前に指定された要素のクリック
   */
  const handleClickAway = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (isItself()) {
      deactivateEventAttr('shown');
      return;
    }
    if (hasChanged(state.current, state.prev)) {
      state.prev = state.current;
      return;
    }
    if (isIgnoredTarget(event.target as HTMLElement)) return;

    dispatch(closeInfoBox());
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='infoWrapper'>{props.children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;

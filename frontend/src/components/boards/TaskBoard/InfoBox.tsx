import React, { useEffect, useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import { TaskList, TaskCard, State } from 'models';
import { InfoBoxProps, removeInfoBox } from 'store/slices/taskBoardSlice';
import {
  useAppDispatch,
  useAppSelector,
  useDeepEqualSelector,
} from 'utils/hooks';
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
  const infoBox = useDeepEqualSelector((state) => state.boards.infoBox);
  const [state, setState] = useState(infoBox);

  useEffect(() => {
    if (!infoBox.open)
      setTimeout(() => setState(infoBox), theme.transitions.duration.standard);
    else setState(infoBox);
  }, [infoBox]);

  const renderInfoBox = () => {
    switch (state.type) {
      case 'board':
        return <React.Fragment />; // <TaskBoardDetails/>
      case 'list':
        return <TaskListDetails list={state.data as TaskList} />;
      case 'card':
        return <TaskCardDetails card={state.data as TaskCard} />;
    }
  };

  return (
    <div className={`${classes.root} ${state.open && classes.open}`}>
      {state.type ? (
        <Wrapper {...infoBox}>{renderInfoBox()}</Wrapper>
      ) : (
        <h2 style={{ textAlign: 'center' }}>There is no content</h2>
      )}
    </div>
  );
};

/**
 * 要素外のクリックで`open`状態を解除する機能を付与するためのラッパー。
 */
const Wrapper: React.FC<InfoBoxProps> = (props) => {
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => state.boards.infoBox);
  const [prevState, setPrevState] = useState<InfoBoxProps>(currentState);
  const state: State<InfoBoxProps> = {
    current: currentState,
    prev: prevState,
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
    if (hasChanged(state)) {
      setPrevState(currentState);
      return;
    }
    if (isIgnoredTarget(event.target as HTMLElement)) return;

    dispatch(removeInfoBox());
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className='infoWrapper'>{props.children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;

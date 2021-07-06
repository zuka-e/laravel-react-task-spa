import React, { useEffect, useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import { TaskList, TaskCard } from 'models';
import {
  infoBoxTypes,
  InfoBoxProps,
  removeInfoBox,
} from 'store/slices/taskBoardSlice';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { TaskListDetails, TaskCardDetails } from '.';

const InfoBox: React.FC<InfoBoxProps> = (props) => {
  const [state, setState] = useState(props);

  useEffect(() => {
    if (!props.open)
      setTimeout(() => setState(props), theme.transitions.duration.standard);
    else setState(props);
  }, [props]);

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

  const NoContent = () => (
    <h2 style={{ textAlign: 'center' }}>There is no content</h2>
  );

  if (!state.type) return <NoContent />;
  else return <Wrapper {...state}>{renderInfoBox()}</Wrapper>;
};

/**
 * 要素外のクリックで`open`状態を解除する機能を付与するためのラッパー。
 * 但し以下の条件によっては要素外でも解除しない
 *
 * - 別のデータを表示する`action`が`dispatch`された場合
 * - クリックした要素とその親要素の`class`に指定されたものを含む場合
 *
 * @param props 表示要求されたデータ情報
 * @member state 表示中のデータ情報
 */
const Wrapper: React.FC<InfoBoxProps> = (props) => {
  const dispatch = useAppDispatch();
  const currentState = useAppSelector((state) => state.boards.infoBox);
  const [state, setState] = useState<InfoBoxProps>(currentState);

  const handleClickAway = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (state.type !== props.type || state.data !== props.data) {
      setState(props);
      return; // 別の`InfoBox`を開く操作の場合は`open`維持
    }

    const eventTarget = event.target as HTMLElement;
    if (typeof eventTarget.className !== 'string') return; // `Icon`等

    const targetOwnClasses = eventTarget.className.split(' ');
    const targetParentClasses = eventTarget.parentElement?.className.split(' ');
    const targetClasses = targetOwnClasses.concat(targetParentClasses || []);
    let ignoredBaseClass = ''; // expected -> board|list|card
    infoBoxTypes.forEach(
      (type, i) => (ignoredBaseClass += `${i !== 0 ? '|' + type : type}`)
    );
    /**  @example 無視される`class`名 : `card`, `cardTitle`, `listText`... */
    const ignoredClass = new RegExp(`^(${ignoredBaseClass})($|[A-Z]+)`);
    const isIgnoredTarget = () =>
      targetClasses.some((targetClass) => ignoredClass.test(targetClass));

    if (isIgnoredTarget()) return;

    dispatch(removeInfoBox());
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>{props.children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;

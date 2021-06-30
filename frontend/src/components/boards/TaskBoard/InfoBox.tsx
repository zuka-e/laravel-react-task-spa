import React, { useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import { TaskCard } from 'models';
import {
  InfoBoxProps,
  closeInfoBox,
  removeInfoBox,
} from 'store/slices/taskBoardSlice';
import { useAppDispatch, useAppSelector } from 'utils/hooks';
import { TaskCardDetails } from '.';

const InfoBox: React.FC<InfoBoxProps> = (props) => {
  const { type, data } = props;

  const renderInfoBox = () => {
    switch (type) {
      case 'board':
        return <React.Fragment />; // <TaskBoardDetails/>
      case 'list':
        return <React.Fragment />; //<TaskListDetails />
      case 'card':
        return <TaskCardDetails card={data as TaskCard} />;
    }
  };

  const NoContent = () => (
    <h2 style={{ textAlign: 'center' }}>There is no content</h2>
  );

  if (!type) return <NoContent />;
  else return <Wrapper>{renderInfoBox()}</Wrapper>;
};

const Wrapper: React.FC = (props) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.boards);
  const [open, setOpen] = useState<number>(state.infoBox.open);

  const handleClickAway = () => {
    // `openInfoBox`を発火させる要素をクリックした場合 (`open`+= 1)
    if (state.infoBox.open !== open) {
      setOpen(state.infoBox.open);
      return; // `open`を維持
    }
    dispatch(closeInfoBox());
    setTimeout(
      () => dispatch(removeInfoBox()),
      theme.transitions.duration.standard + 200
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>{props.children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;

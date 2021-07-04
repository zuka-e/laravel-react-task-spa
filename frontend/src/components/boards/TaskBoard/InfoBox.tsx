import React, { useEffect, useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';

import theme from 'theme';
import { TaskCard } from 'models';
import { InfoBoxProps, removeInfoBox } from 'store/slices/taskBoardSlice';
import { useAppDispatch } from 'utils/hooks';
import { TaskCardDetails } from '.';

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
        return <React.Fragment />; //<TaskListDetails />
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

const Wrapper: React.FC<InfoBoxProps> = (props) => {
  const { type, children } = props;
  const dispatch = useAppDispatch();

  const handleClickAway = (event: React.MouseEvent<Document, MouseEvent>) => {
    const eventTarget = event.target as HTMLElement;
    if (typeof eventTarget.className !== 'string') return;

    const targetClasses = eventTarget.className.split(' ');
    const ignoredClasses = [type, type + 'Title'];
    const isIgnoredTarget = () =>
      ignoredClasses.some((ignoredClass) =>
        targetClasses.includes(ignoredClass!)
      );

    if (isIgnoredTarget()) return;
    dispatch(removeInfoBox());
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>{children}</div>
    </ClickAwayListener>
  );
};

export default InfoBox;

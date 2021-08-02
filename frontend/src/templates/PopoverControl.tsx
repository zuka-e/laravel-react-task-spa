import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Popover, PopoverOrigin } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: 'contents' },
    popover: {
      '& > .MuiPopover-paper': {
        minWidth: '250px',
        maxWidth: '300px',
        border: `1px solid ${theme.palette.info.light}`,
      },
    },
  })
);

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';

const makePopoverOriginSet = (position?: PopoverPosition) => {
  const anchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  const transformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center',
  };

  switch (position) {
    case 'top':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'center';
      transformOrigin.vertical = 'bottom';
      transformOrigin.horizontal = 'center';
      break;
    case 'right':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'right';
      transformOrigin.vertical = 'top';
      transformOrigin.horizontal = 'left';
      break;
    case 'left':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'left';
      transformOrigin.vertical = 'top';
      transformOrigin.horizontal = 'right';
      break;
    case 'bottom':
    default:
      break;
  }

  return { anchorOrigin, transformOrigin };
};

type PopoverControlProps = {
  trigger: JSX.Element;
  position?: PopoverPosition;
};

const PopoverControl: React.FC<PopoverControlProps> = (props) => {
  const { children, trigger, position } = props;
  const classes = useStyles();
  const [className, setClassName] = useState<string | undefined>(classes.root);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);
  const htmlId = open ? 'menu' : undefined;
  const { anchorOrigin, transformOrigin } = makePopoverOriginSet(position);

  /**
   * - `open`時には`class (display: 'contents')`を排除
   * - 時間差を設けてこれを実行することで`Warning: Failed prop type`を回避
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const targetElement = event.currentTarget; // 値の確保
    const readinessTime = 10; // 適当な待機時間
    setTimeout(() => {
      setAnchorEl(targetElement);
    }, readinessTime);
    setClassName(undefined);
  };

  const handleClose = () => {
    setClassName(classes.root);
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <div
        aria-describedby={htmlId}
        onClick={handleClick}
        aria-label='menu'
        className={className}
      >
        {trigger}
      </div>
      <Popover
        className={classes.popover}
        id={htmlId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {children}
      </Popover>
    </React.Fragment>
  );
};

export default PopoverControl;

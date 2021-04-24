import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Popover, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  popover: {
    '& > .MuiPopover-paper': {
      width: '250px',
      border: `1px solid ${theme.palette.info.light}`,
    },
  },
}));

const makePopoverOriginSet = (position: PopoverPosition | undefined) => {
  type PopoverOrigin = {
    vertical: 'top' | 'center' | 'bottom' | number;
    horizontal: 'left' | 'center' | 'right' | number;
  };
  let anchorOrigin: PopoverOrigin, transformOrigin: PopoverOrigin;

  switch (position) {
    case 'top':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'center',
      };
      transformOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      break;
    case 'right':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'right',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'left',
      };
      break;
    case 'left':
      anchorOrigin = {
        vertical: 'top',
        horizontal: 'left',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'right',
      };
      break;
    case 'bottom':
    default:
      anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'center',
      };
      transformOrigin = {
        vertical: 'top',
        horizontal: 'center',
      };
      break;
  }
  return { anchorOrigin, transformOrigin };
};

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';

type PopoverControlProps = {
  trigger: JSX.Element;
  position?: PopoverPosition;
};

const PopoverControl: React.FC<PopoverControlProps> = (props) => {
  const { children, trigger, position } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { anchorOrigin, transformOrigin } = makePopoverOriginSet(position);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const htmlId = open ? 'menu' : undefined;

  return (
    <React.Fragment>
      <Box aria-describedby={htmlId} onClick={handleClick} aria-label='menu'>
        {trigger}
      </Box>
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

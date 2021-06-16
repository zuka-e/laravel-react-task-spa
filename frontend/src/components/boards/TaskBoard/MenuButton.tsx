import React from 'react';

import { Button, Hidden, Tooltip, IconButton } from '@material-ui/core';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

const MenuButton: React.FC = () => (
  <React.Fragment>
    <Hidden smDown>
      <Button variant='outlined'>Menu</Button>
    </Hidden>
    <Hidden mdUp>
      <Tooltip title='Menu' placement='bottom'>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
    </Hidden>
  </React.Fragment>
);

export default MenuButton;

import React, { useState } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  ClickAwayListener,
  TextField,
  InputAdornment,
  IconButton,
  Popper,
  Card,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';

import { SearchResult } from '.';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      minWidth: '320px',
      maxWidth: '350px',
    },
    inputPaper: { backgroundColor: theme.palette.background.paper },
    popper: {
      marginTop: theme.spacing(0.5),
      minWidth: '320px',
      maxWidth: '350px',
      maxHeight: '60vh',
      overflowY: 'auto',
      border: '1px solid' + theme.palette.primary.main,
    },
  })
);

const SEARCH = 'search' as const;

const SearchField = () => {
  const classes = useStyles();
  const [inputOpen, setInputOpen] = useState(false);
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [value, setValue] = useState('');

  const handleClickAway = () => {
    setInputOpen(false);
    setPopperOpen(false);
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setInputOpen(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setValue(input);
  };

  if (!inputOpen)
    return (
      <IconButton onClick={handleOpen} title={SEARCH}>
        <SearchIcon />
      </IconButton>
    );

  return (
    <ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleClickAway}>
      <div aria-labelledby="search-area">
        <TextField
          onFocus={handleFocus}
          onChange={handleChange}
          id={SEARCH}
          type={SEARCH}
          placeholder="Search..."
          defaultValue={value}
          autoFocus
          variant="outlined"
          classes={{ root: classes.input }}
          InputProps={{
            margin: 'dense',
            classes: { root: classes.inputPaper },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Popper open={popperOpen} anchorEl={anchorEl} placement="bottom-end">
          <Card
            classes={{ root: classes.popper }}
            aria-labelledby="search-result"
          >
            <SearchResult input={value} />
          </Card>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default SearchField;

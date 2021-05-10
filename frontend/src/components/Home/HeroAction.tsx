import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Button } from '@material-ui/core';
import {
  PersonAdd as PersonAddIcon,
  LockOpen as LockOpenIcon,
} from '@material-ui/icons';
import GuestAction from './GuestAction';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonLink: {
      '&:hover': {
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
      },
    },
  })
);

const HeroAction: React.FC = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            startIcon={<PersonAddIcon />}
            variant='contained'
            color='primary'
            component={RouterLink}
            to='/register'
            className={classes.buttonLink}
          >
            登録する
          </Button>
        </Grid>
        <Grid item>
          <Button
            startIcon={<LockOpenIcon />}
            variant='contained'
            color='secondary'
            component={RouterLink}
            to='/login'
            className={classes.buttonLink}
          >
            ログイン
          </Button>
        </Grid>
        <Grid item>
          <GuestAction />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default HeroAction;
